// DORO Golden premium state (Local Key Activation)
(function () {
  'use strict';
  const PREMIUM_KEY = 'doro.premium.v1';
  const QUIZ_ATTEMPTS_KEY = 'doro.quizAttempts.v1';
  const BRAND_NAME = 'Golden';
  const PRICE_RUB = 79;
  const QUIZ_LIMIT_FREE = 15;
  
  // ВАШ СЕКРЕТНЫЙ КОД (должен совпадать с тем, что в генераторе ключей)
  const SECRET_KEY = "DORO_SECRET_2026"; // ОБЯЗАТЕЛЬНО ЗАМЕНИТЕ НА СВОЙ!

  function readPremium() {
    try {
      const data = JSON.parse(localStorage.getItem(PREMIUM_KEY) || 'null') || { active: false };
      if (data.active && data.expiresAt && Date.now() > data.expiresAt) {
        data.active = false; // Автоматически снимаем, если истек срок
      }
      return data;
    }
    catch (_) { return { active: false }; }
  }

  function savePremium(data) {
    const normalized = {
      active: !!(data && data.active),
      since: Number(data && data.since) || Date.now(),
      expiresAt: Number(data && data.expiresAt) || 0
    };
    try { localStorage.setItem(PREMIUM_KEY, JSON.stringify(normalized)); } catch (_) {}
    applyClasses(normalized);
    document.dispatchEvent(new CustomEvent('doro:premium-changed'));
  }

  function applyClasses(normalized) {
    const active = normalized.active && (!normalized.expiresAt || normalized.expiresAt > Date.now());
    if (active) {
      document.documentElement.classList.add('role-premium');
      document.documentElement.classList.remove('role-user');
    } else {
      document.documentElement.classList.remove('role-premium');
      if (!document.documentElement.classList.contains('role-admin') &&
          !document.documentElement.classList.contains('role-editor')) {
        document.documentElement.classList.add('role-user');
      }
    }
  }

  function isPremiumActive() {
    const p = readPremium();
    return !!p.active && (!p.expiresAt || p.expiresAt > Date.now());
  }

  function daysLeft() {
    const p = readPremium();
    if (!p.active || !p.expiresAt) return 0;
    return Math.max(0, Math.ceil((p.expiresAt - Date.now()) / 86400000));
  }

  async function activateKey(token) {
    if (!token || !token.startsWith('GOLD.')) throw new Error('Неверный формат ключа.');
    
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Ключ поврежден.');
    
    try {
      const payload = JSON.parse(decodeURIComponent(escape(atob(parts[1]))));
      
      // 1. Проверка срока действия
      if (payload.e && Date.now() > payload.e) {
        throw new Error('Срок действия ключа истек.');
      }
      
      // 2. Проверка подписи (защита от подделки)
      const key = await crypto.subtle.importKey(
        'raw', new TextEncoder().encode(SECRET_KEY),
        { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
      );
      const sig = Uint8Array.from(atob(parts[2]), c => c.charCodeAt(0));
      const isValid = await crypto.subtle.verify(
        'HMAC', key, sig, new TextEncoder().encode(parts[1])
      );
      
      if (!isValid) throw new Error('Ключ недействителен (неверная подпись).');

      // 3. ПРОВЕРКА: Не использовался ли код ранее на этом устройстве
      const usedCodes = JSON.parse(localStorage.getItem('doro.usedKeys') || '[]');
      if (usedCodes.includes(token)) {
        throw new Error('Этот код уже был активирован на этом устройстве.');
      }

      // 4. ПРОВЕРКА: Привязка к нику (Имя + Группа)
      if (payload.u && payload.u !== "user") {
        const me = JSON.parse(localStorage.getItem('doro.user') || 'null');
        // Собираем полное имя пользователя (Имя + Группа) для сравнения
        const myFullIdentity = me && me.name ? (me.name + ' ' + (me.group || '')).trim().toLowerCase() : '';
        const keyIdentity = payload.u.trim().toLowerCase();
        
        // Проверяем, совпадает ли полное имя и группа
        if (!myFullIdentity.includes(keyIdentity)) {
          throw new Error('Этот код выдан для другого пользователя (не совпадает имя или группа).');
        }
      }

      // Успех! Сохраняем код как использованный
      usedCodes.push(token);
      localStorage.setItem('doro.usedKeys', JSON.stringify(usedCodes));

      // Сохраняем подписку
      savePremium({
        active: true,
        since: Date.now(),
        expiresAt: payload.e || (Date.now() + 30 * 86400000)
      });
      return true;
    } catch (err) {
      throw new Error(err.message || 'Ошибка активации');
    }
  }

  function deactivatePremium() {
    savePremium({ active: false });
  }

  // --- ЛИМИТЫ ТЕСТОВ ---
  function readAttempts() {
    try { return JSON.parse(localStorage.getItem(QUIZ_ATTEMPTS_KEY) || '{}'); }
    catch (_) { return {}; }
  }
  function getQuizAttempts(key) { return readAttempts()[key] || 0; }
  function addQuizAttempt(key) {
    const all = readAttempts();
    all[key] = (all[key] || 0) + 1;
    localStorage.setItem(QUIZ_ATTEMPTS_KEY, JSON.stringify(all));
  }
  function canStartQuiz(key) { return isPremiumActive() || getQuizAttempts(key) < QUIZ_LIMIT_FREE; }
  function quizAttemptsLeft(key) { return isPremiumActive() ? Infinity : Math.max(0, QUIZ_LIMIT_FREE - getQuizAttempts(key)); }
  function quizAttemptsLabel(key) { return isPremiumActive() ? 'Без лимита' : (quizAttemptsLeft(key) > 0 ? `Осталось ${quizAttemptsLeft(key)}` : 'Лимит исчерпан'); }

  function init() {
    applyClasses(readPremium());
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.doroPremium = {
    BRAND_NAME, PRICE_RUB, QUIZ_LIMIT_FREE,
    isPremiumActive, daysLeft, activateKey, deactivatePremium, // activatePremium заменили на activateKey
    getQuizAttempts, addQuizAttempt, canStartQuiz, quizAttemptsLeft, quizAttemptsLabel,
    readPremium, savePremium
  };
})();