// DORO Golden premium state and payment-request workflow
(function () {
  'use strict';
  const PREMIUM_KEY = 'doro.premium.v1';
  const QUIZ_ATTEMPTS_KEY = 'doro.quizAttempts.v1';
  const BRAND_NAME = 'Golden';
  const PRICE_RUB = 79;
  const QUIZ_LIMIT_FREE = 15;
  const FIRESTORE_MODULE = 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
  const REQUEST_CACHE_TTL = 60 * 1000;
  let requestCache = { uid: '', time: 0, value: null };
  let requestReadPromise = null;

  function readPremium() {
    try { return JSON.parse(localStorage.getItem(PREMIUM_KEY) || 'null') || { active: false }; }
    catch (_) { return { active: false }; }
  }
  function savePremium(data) {
    const normalized = {
      active: !!(data && data.active),
      since: Number(data && data.since) || Date.now(),
      expiresAt: Number(data && data.expiresAt) || 0
    };
    try { localStorage.setItem(PREMIUM_KEY, JSON.stringify(normalized)); } catch (_) {}
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
    document.dispatchEvent(new CustomEvent('doro:premium-changed'));
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
  function activatePremium(days) {
    const data = readPremium();
    const base = data.active && data.expiresAt && data.expiresAt > Date.now()
      ? data.expiresAt : Date.now();
    savePremium({
      active: true,
      since: data.since || Date.now(),
      expiresAt: base + (Number(days) || 30) * 86400000
    });
    // Compatibility with the previous UI/API. The authoritative subscription
    // fields for admin approvals remain users.premiumActive/premiumExpiresAt.
    try {
      if (window.doroCloudReady) {
        const snap = readPremium();
        window.doroCloudReady.then(cloud => {
          if (cloud && cloud.saveProfile) {
            const u = JSON.parse(localStorage.getItem('doro.user') || '{}');
            cloud.saveProfile({ ...u, premium: { active: true, expiresAt: snap.expiresAt } });
          }
        });
      }
    } catch (_) {}
    return true;
  }
  function deactivatePremium() {
    savePremium({ active: false });
    try {
      if (window.doroCloudReady) {
        window.doroCloudReady.then(cloud => {
          if (cloud && cloud.saveProfile) {
            const u = JSON.parse(localStorage.getItem('doro.user') || '{}');
            cloud.saveProfile({ ...u, premium: { active: false, expiresAt: 0 } });
          }
        });
      }
    } catch (_) {}
  }
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

  async function firestore() {
    if (!window.doroDb) throw new Error('Нет подключения к базе данных.');
    return import(FIRESTORE_MODULE);
  }
  function timestampMs(v) {
    if (typeof v === 'number') return v;
    if (v && typeof v.toMillis === 'function') return v.toMillis();
    return 0;
  }
  async function getMyPaymentRequest(force = false) {
    if (!window.doroDb) return null;
    const uid = window.doroCloud && window.doroCloud.uid;
    if (!uid) return null;
    if (!force && requestCache.uid === uid && Date.now() - requestCache.time < REQUEST_CACHE_TTL) return requestCache.value;
    if (requestReadPromise) return requestReadPromise;
    requestReadPromise = (async () => { try {
      const { collection, getDocs, query, where } = await firestore();
      // No orderBy: avoids requiring a composite index. Sort the small user's request set client-side.
      const snap = await getDocs(query(collection(window.doroDb, 'payment_requests'), where('uid', '==', uid)));
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      all.sort((a, b) => timestampMs(b.createdAt) - timestampMs(a.createdAt));
      // Keep the existing pending request visible even if a newer rejected request exists.
      const result = all.find(r => r.status === 'pending') ||
        all.find(r => r.status === 'approved' && timestampMs(r.approvedExpiresAt) > Date.now()) || all[0] || null;
      requestCache = { uid, time: Date.now(), value: result };
      return result;
    } catch (e) {
      console.warn('[Golden] getMyPaymentRequest:', e.message || e);
      return null;
    } finally { requestReadPromise = null; } })();
    return requestReadPromise;
  }
  let submitInFlight = null;
  async function submitPaymentRequest() {
    // Блокируем двойное нажатие: две быстрые попытки не создадут две заявки.
    if (submitInFlight) return submitInFlight;
    submitInFlight = (async () => {
      if (!window.doroDb) throw new Error('Нет подключения к базе данных.');
      const uid = window.doroCloud && window.doroCloud.uid;
      if (!uid) throw new Error('Сначала войди в аккаунт.');
      const u = JSON.parse(localStorage.getItem('doro.user') || 'null');
      if (!u || !u.name || !u.group) throw new Error('Сначала заполни имя и группу в профиле.');

      const existing = await getMyPaymentRequest(true);
      if (existing && existing.status === 'pending') return existing.id;
      if (existing && existing.status === 'approved' && timestampMs(existing.approvedExpiresAt) > Date.now()) {
        throw new Error('У тебя уже есть одобренная заявка Golden. Если подписка не отображается, обнови страницу или обратись к администратору.');
      }

      const { collection, doc, setDoc, serverTimestamp } = await firestore();
      const reqId = 'pay_' + uid + '_' + Date.now();
      await setDoc(doc(window.doroDb, 'payment_requests', reqId), {
        uid: String(uid), name: String(u.name).trim(), group: String(u.group).trim(),
        amount: PRICE_RUB, days: 30, status: 'pending', createdAt: serverTimestamp(), source: 'manual_transfer'
      });
      requestCache = { uid, time: 0, value: null };
      return reqId;
    })();
    try { return await submitInFlight; }
    finally { submitInFlight = null; }
  }

  function init() {
    if (isPremiumActive()) {
      document.documentElement.classList.add('role-premium');
      document.documentElement.classList.remove('role-user');
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.doroPremium = {
    BRAND_NAME, PRICE_RUB, QUIZ_LIMIT_FREE,
    isPremiumActive, daysLeft, activatePremium, deactivatePremium,
    getQuizAttempts, addQuizAttempt, canStartQuiz, quizAttemptsLeft, quizAttemptsLabel,
    readPremium, savePremium, submitPaymentRequest, getMyPaymentRequest
  };
})();
