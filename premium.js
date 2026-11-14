// ============================================================
//  premium.js — премиум doro: состояние, лимиты, хранилище
// ============================================================
(function () {
  'use strict';

  const PREMIUM_KEY = 'doro.premium.v1';
  const QUIZ_ATTEMPTS_KEY = 'doro.quizAttempts.v1';
  const BRAND_NAME = 'Golden';
  const PRICE_RUB = 79;
  const QUIZ_LIMIT_FREE = 15;

  // ---- чтение/запись состояния ----
  function readPremium() {
    try { return JSON.parse(localStorage.getItem(PREMIUM_KEY) || 'null') || { active: false }; }
    catch (e) { return { active: false }; }
  }
  function savePremium(data) {
    localStorage.setItem(PREMIUM_KEY, JSON.stringify(data));
    // Синхронизируем классы на <html>
    if (data && data.active && (!data.expiresAt || data.expiresAt > Date.now())) {
      document.documentElement.classList.add('role-premium');
      document.documentElement.classList.remove('role-user');
    } else {
      document.documentElement.classList.remove('role-premium');
      document.documentElement.classList.add('role-user');
    }
    document.dispatchEvent(new CustomEvent('doro:premium-changed'));
  }
  function isPremiumActive() {
    const p = readPremium();
    if (!p.active) return false;
    if (p.expiresAt && p.expiresAt < Date.now()) return false;
    return true;
  }
  function daysLeft() {
    const p = readPremium();
    if (!p.active || !p.expiresAt) return 0;
    return Math.max(0, Math.ceil((p.expiresAt - Date.now()) / 86400000));
  }
  function activatePremium(days) {
    const data = readPremium();
    const base = (data.active && data.expiresAt && data.expiresAt > Date.now())
      ? data.expiresAt : Date.now();
    savePremium({
      active: true,
      since: data.since || Date.now(),
      expiresAt: base + (days || 30) * 86400000,
    });
    document.documentElement.classList.add('role-premium');
    document.documentElement.classList.remove('role-user');
    document.dispatchEvent(new CustomEvent('doro:premium-changed'));

    // ★ Сохраняем премиум в облако, чтобы другие видели
    try {
      if (window.doroCloudReady) {
        const doroPremiumSnap = readPremium();
        window.doroCloudReady.then(cloud => {
          if (cloud && cloud.saveProfile) {
            const u = JSON.parse(localStorage.getItem('doro.user') || '{}');
            cloud.saveProfile({
              ...u,
              premium: { active: true, expiresAt: doroPremiumSnap.expiresAt }
            });
          }
        });
      }
    } catch (e) { /* ignore */ }

    return true;
  }
  function deactivatePremium() {
    savePremium({ active: false });
    document.documentElement.classList.remove('role-premium');
    document.documentElement.classList.add('role-user');
    document.dispatchEvent(new CustomEvent('doro:premium-changed'));

    // ★ Снимаем премиум в облаке
    try {
      if (window.doroCloudReady) {
        window.doroCloudReady.then(cloud => {
          if (cloud && cloud.saveProfile) {
            const u = JSON.parse(localStorage.getItem('doro.user') || '{}');
            cloud.saveProfile({
              ...u,
              premium: { active: false, expiresAt: 0 }
            });
          }
        });
      }
    } catch (e) { /* ignore */ }
  }

  // ---- лимит попыток тестов ----
  function readAttempts() {
    try { return JSON.parse(localStorage.getItem(QUIZ_ATTEMPTS_KEY) || '{}'); }
    catch (e) { return {}; }
  }
  function getQuizAttempts(subjectKey) {
    return readAttempts()[subjectKey] || 0;
  }
  function addQuizAttempt(subjectKey) {
    const all = readAttempts();
    all[subjectKey] = (all[subjectKey] || 0) + 1;
    localStorage.setItem(QUIZ_ATTEMPTS_KEY, JSON.stringify(all));
  }
  function canStartQuiz(subjectKey) {
    if (isPremiumActive()) return true;
    return getQuizAttempts(subjectKey) < QUIZ_LIMIT_FREE;
  }
  function quizAttemptsLeft(subjectKey) {
    if (isPremiumActive()) return Infinity;
    return Math.max(0, QUIZ_LIMIT_FREE - getQuizAttempts(subjectKey));
  }
  function quizAttemptsLabel(subjectKey) {
    if (isPremiumActive()) return 'Без лимита';
    const left = quizAttemptsLeft(subjectKey);
    return left > 0 ? `Осталось ${left}` : 'Лимит исчерпан';
  }

  // ---- инициализация ----
  function init() {
    if (isPremiumActive()) {
      document.documentElement.classList.add('role-premium');
      document.documentElement.classList.remove('role-user');
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.doroPremium = {
    BRAND_NAME,
    PRICE_RUB, QUIZ_LIMIT_FREE,
    isPremiumActive, daysLeft, activatePremium, deactivatePremium,
    getQuizAttempts, addQuizAttempt, canStartQuiz, quizAttemptsLeft,
    quizAttemptsLabel,
    readPremium, savePremium,
    submitPaymentRequest,
    getMyPaymentRequest,
  };

  // ============================================================
  //  ЗАЯВКА НА ОПЛАТУ (для ручной активации)
  // ============================================================
  async function submitPaymentRequest() {
    if (!window.doroDb) throw new Error('Нет подключения к базе');
    const uid = window.doroCloud?.uid;
    if (!uid) throw new Error('Нет авторизации');

    const u = JSON.parse(localStorage.getItem('doro.user') || '{}');
    if (!u.name || !u.group) throw new Error('Сначала заполни имя и группу в профиле');

    const { setDoc, doc, serverTimestamp } = await import(
      "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
    );

    const reqId = 'pay_' + uid + '_' + Date.now();

    await setDoc(doc(window.doroDb, 'payment_requests', reqId), {
      uid,
      name: u.name,
      group: u.group,
      amount: 79,
      days: 30,
      status: 'pending',
      createdAt: serverTimestamp(),
      source: 'manual_transfer',
    });

    return reqId;
  }

  async function getMyPaymentRequest() {
    if (!window.doroDb) return null;
    const uid = window.doroCloud?.uid;
    if (!uid) return null;

    const { query, collection, where, getDocs, orderBy, limit } = await import(
      "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
    );

    try {
      const q = query(
        collection(window.doroDb, 'payment_requests'),
        where('uid', '==', uid),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      const snap = await getDocs(q);
      if (snap.empty) return null;
      const d = snap.docs[0];
      return { id: d.id, ...d.data() };
    } catch (e) {
      console.warn('[pay] getMyPaymentRequest:', e.message);
      return null;
    }
  }
})();