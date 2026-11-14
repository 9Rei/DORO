// ============================================================
//  admin.js — встроенная админ-панель для создателя
// ============================================================
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);

  let activeTab = 'requests';
  let _interval = null;

  // ---------- Проверка роли ----------
  function isAdmin() {
    return document.documentElement.classList.contains('role-admin');
  }

  // ---------- Утилиты ----------
  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function userDocId(name, group) {
    const n = (name || '').trim().replace(/\s+/g, ' ').toLowerCase();
    const g = (group || '').trim().toLowerCase(); // <-- ИСПРАВЛЕНО
    return n + '__' + g;
  }

  function pluralDays(n) {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return 'день';
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return 'дня';
    return 'дней';
  }

  function agoText(ts) {
    if (!ts) return '';
    const ms = typeof ts === 'number' ? ts : (ts.toMillis ? ts.toMillis() : new Date(ts).getTime());
    const diff = Date.now() - ms;
    const m = Math.round(diff / 60000);
    if (m < 1) return 'только что';
    if (m < 60) return m + ' мин назад';
    const h = Math.round(m / 60);
    if (h < 24) return h + ' ч назад';
    const d = Math.round(h / 24);
    return d + ' дн назад';
  }

  // ---------- Заявки ----------
  async function loadRequests() {
    const panel = $('adminPanel');
    const badge = $('adminRequestsBadge');
    if (!panel) return;

    if (!window.doroDb) {
      panel.innerHTML = '<div class="admin-empty"><div class="admin-empty__icon">⚠️</div><b>Нет подключения к базе</b><span>Проверь Firebase</span></div>';
      return;
    }

    try {
      const { getDocs, collection, query, where, orderBy } = await import(
        "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
      );

      const q = query(
        collection(window.doroDb, 'payment_requests'),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);

      if (badge) {
        badge.hidden = snap.size === 0;
        badge.textContent = String(snap.size);
      }

      if (snap.empty) {
        panel.innerHTML = `
          <button type="button" class="admin-refresh" id="adminRefreshBtn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
            Обновить
          </button>
          <div class="admin-empty">
            <div class="admin-empty__icon">🎉</div>
            <b>Заявок нет</b>
            <span>Как только кто-то нажмёт «Я оплатил» — заявка появится здесь.</span>
          </div>
        `;
        bindRefresh();
        return;
      }

      let html = `
        <button type="button" class="admin-refresh" id="adminRefreshBtn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
          Обновить
        </button>
        <div class="admin-group-title">
          <b>Ожидают подтверждения</b>
          <span>${snap.size} ${snap.size === 1 ? 'заявка' : (snap.size < 5 ? 'заявки' : 'заявок')}</span>
        </div>
      `;

      snap.docs.forEach(docSnap => {
        const r = docSnap.data();
        const id = docSnap.id;
        const reqId = escapeHtml(id);
        const name = escapeHtml(r.name || '?');
        const group = escapeHtml(r.group || '?');
        const amount = r.amount || 79;
        const days = r.days || 30;
        const ago = agoText(r.createdAt);

        html += `
          <div class="admin-req" data-req-id="${reqId}">
            <div class="admin-req__body">
              <div class="admin-req__name">
                ${name}
                <span class="admin-req__badge">${group}</span>
              </div>
              <div class="admin-req__meta">
                <span><b>${amount} ₽</b></span>
                <span>·</span>
                <span>${days} ${pluralDays(days)} Golden</span>
                ${ago ? `<span>·</span><span class="admin-req__ago">${ago}</span>` : ''}
              </div>
            </div>
            <div class="admin-req__actions">
              <button type="button" class="admin-btn admin-btn--approve" data-approve="${reqId}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Активировать
              </button>
              <button type="button" class="admin-btn admin-btn--reject" data-reject="${reqId}">
                Отклонить
              </button>
            </div>
          </div>
        `;
      });

      panel.innerHTML = html;

      panel.querySelectorAll('[data-approve]').forEach(btn => {
        btn.addEventListener('click', () => approveRequest(btn.dataset.approve, btn));
      });
      panel.querySelectorAll('[data-reject]').forEach(btn => {
        btn.addEventListener('click', () => rejectRequest(btn.dataset.reject, btn));
      });
      bindRefresh();
    } catch (e) {
      console.error('[admin] loadRequests:', e);
      panel.innerHTML = `
        <div class="admin-empty">
          <div class="admin-empty__icon">⚠️</div>
          <b>Не удалось загрузить</b>
          <span>${escapeHtml(e.message || 'Ошибка')}</span>
          <span style="font-size:11.5px; opacity:0.7; margin-top:8px;">
            Возможно, нужно создать composite index в Firestore:<br>
            <code>payment_requests: status ASC, createdAt DESC</code>
          </span>
        </div>
      `;
    }
  }

  function bindRefresh() {
    const btn = $('adminRefreshBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        loadRequests().finally(() => {
          btn.disabled = false;
          btn.style.opacity = '';
        });
      });
    }
  }

  // ---------- Одобрение ----------
  async function approveRequest(reqId, btn) {
    if (!confirm('Активировать Golden на 30 дней для этой заявки?')) return;

    btn.disabled = true;
    const oldText = btn.innerHTML;
    btn.innerHTML = 'Активирую…';

    try {
      const {
        getDoc, doc, updateDoc, serverTimestamp, runTransaction
      } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");

      const reqRef = doc(window.doroDb, 'payment_requests', reqId);
      const reqSnap = await getDoc(reqRef);
      if (!reqSnap.exists()) throw new Error('Заявка не найдена');

      const r = reqSnap.data();
      const days = r.days || 30;
      const userDocId = userDocIdFor(r.name, r.group);
      const userRef = doc(window.doroDb, 'users', userDocId);

      // Транзакция: активируем Golden и помечаем заявку
      const result = await runTransaction(window.doroDb, async (tx) => {
        const userSnap = await tx.get(userRef);
        const cur = userSnap.exists() ? userSnap.data() : {};
        const base = (cur.premiumActive && cur.premiumExpiresAt > Date.now())
          ? cur.premiumExpiresAt
          : Date.now();
        const newExpires = base + days * 86400000;

        tx.set(userRef, {
          premiumActive: true,
          premiumExpiresAt: newExpires,
          updatedAt: serverTimestamp()
        }, { merge: true });

        tx.update(reqRef, {
          status: 'approved',
          approvedAt: serverTimestamp(),
          approvedExpiresAt: newExpires
        });

        return { newExpires };
      });

      // Уведомление
      const date = new Date(result.newExpires).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
      alert(`Golden активирован до ${date}. У пользователя появится в течение пары минут.`);

      loadRequests();
    } catch (e) {
      console.error('[admin] approve:', e);
      alert('Ошибка: ' + (e.message || e));
      btn.disabled = false;
      btn.innerHTML = oldText;
    }
  }

  // ---------- Отклонение ----------
  async function rejectRequest(reqId, btn) {
    if (!confirm('Отклонить заявку? Пользователь получит отказ.')) return;

    btn.disabled = true;
    try {
      const { updateDoc, doc, serverTimestamp } = await import(
        "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
      );
      await updateDoc(doc(window.doroDb, 'payment_requests', reqId), {
        status: 'rejected',
        rejectedAt: serverTimestamp()
      });
      loadRequests();
    } catch (e) {
      alert('Ошибка: ' + e.message);
      btn.disabled = false;
    }
  }

 function userDocIdFor(name, group) {
    const n = (name || '').trim().replace(/\s+/g, ' ').toLowerCase();
    const g = (group || '').trim().toLowerCase(); // <-- ИСПРАВЛЕНО
    return n + '__' + g;
  }

  // ---------- Переключение вкладок ----------
  function bindTabs() {
    document.querySelectorAll('[data-admin-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.adminTab;
        if (tab === activeTab) return;
        activeTab = tab;
        document.querySelectorAll('[data-admin-tab]').forEach(b => {
          b.classList.toggle('is-active', b.dataset.adminTab === tab);
        });
        render();
      });
    });
  }

  // ---------- Рендер текущей вкладки ----------
  function render() {
    if (activeTab === 'requests') {
      loadRequests();
    } else if (activeTab === 'activated') {
      renderActivatedTab();
    }
  }

  // ---------- Активированные подписки ----------
  async function renderActivatedTab() {
    const panel = $('adminPanel');
    if (!panel) return;

    panel.innerHTML = `
      <button type="button" class="admin-refresh" id="adminRefreshBtn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
        Обновить
      </button>
      <div id="adminActivatedList">
        <div class="admin-empty">Загрузка…</div>
      </div>
    `;
    bindRefresh();
    loadActivated();
  }

  async function loadActivated() {
    const list = $('adminActivatedList');
    if (!list || !window.doroDb) return;

    try {
      const { getDocs, collection, query, where, orderBy } = await import(
        "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
      );

      // Берём заявки со статусом approved
      const q = query(
        collection(window.doroDb, 'payment_requests'),
        where('status', '==', 'approved'),
        orderBy('approvedAt', 'desc')
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        list.innerHTML = `
          <div class="admin-empty">
            <div class="admin-empty__icon">💎</div>
            <b>Пока никого</b>
            <span>Как только ты активируешь первую заявку — она появится здесь.</span>
          </div>
        `;
        return;
      }

      list.innerHTML = '';
      snap.docs.forEach(d => {
        const r = d.data();
        const reqId = d.id;
        const name = escapeHtml(r.name || '?');
        const group = escapeHtml(r.group || '?');
        const uid = escapeHtml(r.uid || '—');
        const days = r.days || 30;
        const expires = r.approvedExpiresAt
          ? new Date(r.approvedExpiresAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
          : '—';
        const approvedAt = r.approvedAt?.toMillis
          ? new Date(r.approvedAt.toMillis()).toLocaleDateString('ru-RU')
          : '—';

        const el = document.createElement('div');
        el.className = 'admin-req';
        el.innerHTML = `
          <div class="admin-req__body">
            <div class="admin-req__name">
              ${name}
              <span class="admin-req__badge">${group}</span>
            </div>
            <div class="admin-req__meta">
              <span><b>${days}</b> ${pluralDays(days)} Golden</span>
              <span>·</span>
              <span>до <b>${expires}</b></span>
              <span>·</span>
              <span class="admin-req__ago">активирована ${approvedAt}</span>
            </div>
            <div class="admin-req__meta" style="margin-top:6px;">
              <span style="font-family: 'SFMono-Regular', Consolas, monospace; font-size:11px; word-break:break-all;">
                UID: <b>${uid}</b>
              </span>
            </div>
          </div>
          <div class="admin-req__actions">
            <button type="button" class="admin-btn admin-btn--reject" data-revoke="${escapeHtml(reqId)}" data-name="${name}" data-group="${group}">
              Отозвать
            </button>
          </div>
        `;
        list.appendChild(el);
      });

      // Обработчик отзыва
      list.querySelectorAll('[data-revoke]').forEach(btn => {
        btn.addEventListener('click', () => revokeActivation(btn.dataset.revoke, btn.dataset.name, btn.dataset.group, btn));
      });

    } catch (e) {
      console.error('[admin] loadActivated:', e);
      list.innerHTML = `<div class="admin-empty">Ошибка: ${escapeHtml(e.message || 'Не удалось загрузить')}</div>`;
    }
  }

  async function revokeActivation(reqId, name, group, btn) {
    if (!confirm(`Отозвать Golden у ${name} (${group})? Подписка снимется, заявка снова станет "ожидает".`)) return;

    btn.disabled = true;
    btn.textContent = 'Отзываю…';

    try {
      const { getDoc, doc, updateDoc, setDoc, serverTimestamp } = await import(
        "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
      );

      // Возвращаем заявку в pending
      await updateDoc(doc(window.doroDb, 'payment_requests', reqId), {
        status: 'pending',
        approvedAt: null,
        approvedExpiresAt: null
      });

      // Снимаем премиум у пользователя
      const userDocId = userDocIdFor(name, group);
      const userRef = doc(window.doroDb, 'users', userDocId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        await setDoc(userRef, {
          premiumActive: false,
          premiumExpiresAt: 0,
          updatedAt: serverTimestamp()
        }, { merge: true });
      }

      alert('Golden отозван. Заявка вернулась в ожидающие.');
      loadActivated();
    } catch (e) {
      console.error('[admin] revoke:', e);
      alert('Ошибка: ' + (e.message || e));
      btn.disabled = false;
      btn.textContent = 'Отозвать';
    }
  }
  // ---------- Инициализация ----------
  function init() {
    // Ждём, пока roles.js проставит роль
    let tries = 0;
    const wait = setInterval(() => {
      tries++;
      if (isAdmin()) {
        clearInterval(wait);
        setup();
      } else if (tries > 50) { // 5 секунд
        clearInterval(wait);
        // Если так и не админ — просто не показываем ничего
      }
    }, 100);
  }

  function setup() {
    if (!$('view-admin')) return;

    bindTabs();

    // Клик по пункту меню «Админ» → загружаем данные
    document.querySelectorAll('a[data-view="admin"]').forEach(link => {
      link.addEventListener('click', () => {
        setTimeout(() => render(), 200);
      });
    });

    // Реакция на roles-ready (если роль пришла позже)
    document.addEventListener('doro:roles-ready', () => {
      if (isAdmin()) setup();
    });

    // Автообновление раз в минуту, если мы на вкладке админа
    if (_interval) clearInterval(_interval);
    _interval = setInterval(() => {
      const adminView = $('view-admin');
      if (!adminView || !adminView.classList.contains('is-active')) return;
      if (activeTab === 'requests') loadRequests();
      else if (activeTab === 'activated') loadActivated();
    }, 60000);
  }

  // Стартуем после загрузки страницы
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();