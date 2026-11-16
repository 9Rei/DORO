// DORO Golden approval workflow — replacement for admin.js
// Firestore schema: users/{normalizedName}__{normalizedGroup}
//   premiumActive: boolean, premiumExpiresAt: number (Unix ms), updatedAt: timestamp
// payment_requests/{requestId}
//   uid, name, group, amount, days, status, createdAt, approvedAt, approvedExpiresAt, source
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const FIRESTORE_MODULE = 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
  let activeTab = 'requests';
  let refreshTimer = null;
  let initialized = false;
  let busy = false;
  // Short in-memory cache avoids rereading the same request list when the admin
  // switches tabs/views. Explicit refresh and completed actions bypass it.
  const requestCache = new Map();
  const REQUEST_CACHE_MS = 20_000;
  function invalidateRequestCache() { requestCache.clear(); }

  const normalize = (v) => String(v || '').trim().replace(/\s+/g, ' ').toLowerCase();
  const escapeHtml = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
  const userDocId = (name, group) => `${normalize(name)}__${normalize(group)}`;
  const msOf = (v) => {
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    if (v && typeof v.toMillis === 'function') return v.toMillis();
    if (v instanceof Date) return v.getTime();
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };
  const formatDate = (v) => {
    const ms = msOf(v);
    return ms > 0 ? new Date(ms).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'long', year: 'numeric'
    }) : '—';
  };
  const agoText = (v) => {
    const ms = msOf(v);
    if (!ms) return '';
    const mins = Math.max(0, Math.round((Date.now() - ms) / 60000));
    if (mins < 1) return 'только что';
    if (mins < 60) return `${mins} мин назад`;
    const hours = Math.round(mins / 60);
    if (hours < 24) return `${hours} ч назад`;
    return `${Math.round(hours / 24)} дн назад`;
  };
  const pluralDays = (n) => {
    const x = Math.abs(Number(n) || 0), a = x % 10, b = x % 100;
    if (a === 1 && b !== 11) return 'день';
    if (a >= 2 && a <= 4 && (b < 10 || b >= 20)) return 'дня';
    return 'дней';
  };
  const firestore = async () => {
    if (!window.doroDb) throw new Error('Firebase Firestore не подключён. Проверь firebase.js.');
    return import(FIRESTORE_MODULE);
  };
  const clearUserCache = () => {
    try {
      localStorage.removeItem('doro.usersCache.v2');
      localStorage.removeItem('doro.usersCache');
    } catch (_) {}
  };
  const getRequest = async (reqId) => {
    const { doc, getDoc } = await firestore();
    const snap = await getDoc(doc(window.doroDb, 'payment_requests', reqId));
    if (!snap.exists()) throw new Error('Заявка не найдена. Обнови список.');
    return { id: snap.id, ...snap.data() };
  };

  // Resolve the profile by UID first. If that lookup succeeds, do not mix its
  // result with name/group-derived IDs: those legacy IDs may point to the same
  // person and create a false "multiple profiles" error.
  async function getCandidateUserRefs(request) {
    const { collection, doc, getDocs, query, where } = await firestore();

    if (request.uid) {
      try {
        const snap = await getDocs(query(
          collection(window.doroDb, 'users'),
          where('uid', '==', String(request.uid))
        ));
        if (!snap.empty) {
          // If multiple documents really carry this UID, return only those
          // exact UID matches so the transaction can report the actual conflict.
          return snap.docs.map(d => doc(window.doroDb, 'users', d.id));
        }
        // A successful UID query returned zero documents. Fall back to the two
        // historical IDs, but transaction validation below will never treat a
        // different UID as the requested user.
      } catch (e) {
        // Query may be denied by legacy rules; try deterministic document IDs.
        console.warn('[Golden] UID profile lookup failed; trying deterministic IDs:', e.message || e);
      }
    }

    const n = normalize(request.name);
    const group = String(request.group || '').trim().replace(/\\s+/g, ' ');
    const ids = new Set();
    if (n && group) {
      ids.add(`${n}__${normalize(group)}`);
      ids.add(`${n}__${group.toLowerCase()}`);
      ids.add(`${n}__${group.toUpperCase()}`);
    }
    return [...ids].filter(Boolean).map(id => doc(window.doroDb, 'users', id));
  }

  function isSamePerson(data, request) {
    if (!data) return false;

    // If the request has a UID, UID is the ONLY matching key.
    // A profile with another UID OR with no UID is not considered the same person.
    // This prevents same-name/same-group legacy profiles from creating ambiguity.
    if (request.uid) return String(data.uid || '') === String(request.uid);

    // Only legacy requests that genuinely have no UID may use name + group.
    return normalize(data.name) === normalize(request.name) &&
      normalize(data.group) === normalize(request.group);
  }

  async function applyRequest(reqId, mode) {
    if (busy) throw new Error('Дождись завершения предыдущей операции.');
    busy = true;
    try {
      const { doc, getDoc, runTransaction, serverTimestamp } = await firestore();
      const reqRef = doc(window.doroDb, 'payment_requests', reqId);
      const request = await getRequest(reqId);
      if (!request.uid || !request.name || !request.group) {
        throw new Error('В заявке отсутствует UID, имя или группа. Не активируй её вручную — сначала проверь документ заявки.');
      }
      const refs = await getCandidateUserRefs(request);
      if (!refs.length) throw new Error('Не удалось определить документ пользователя.');
      const now = Date.now();
      const result = await runTransaction(window.doroDb, async (tx) => {
        const reqSnap = await tx.get(reqRef);
        if (!reqSnap.exists()) throw new Error('Заявка была удалена.');
        const req = reqSnap.data();
        const userSnaps = await Promise.all(refs.map(ref => tx.get(ref)));
        const candidates = userSnaps.map((snap, i) => ({
          snap, ref: refs[i], data: snap.exists() ? snap.data() : null
        })).filter(x => x.snap.exists() && isSamePerson(x.data, req));
        candidates.sort((a, b) => {
          const auid = req.uid && a.data.uid === req.uid ? 1 : 0;
          const buid = req.uid && b.data.uid === req.uid ? 1 : 0;
          return buid - auid;
        });
        let chosen = candidates[0] || null;
        if (candidates.length > 1) {
          const ids = candidates.map(x => x.ref.id);
          throw new Error(
            `В users действительно найдено несколько документов с UID этой заявки: ${ids.join(', ')}. ` +
            'Это уже конфликт данных Firestore; ничего не изменено. Проверь эти документы вручную.'
          );
        }
        if (chosen && req.uid && String(chosen.data.uid || '') !== String(req.uid)) {
          throw new Error('UID заявки не совпадает с UID профиля. Активация остановлена для защиты аккаунта.');
        }
        // Never overwrite an existing profile that did not match the request UID.
        // Creating a profile is allowed only if all deterministic candidate docs are absent.
        if (!chosen && userSnaps.some(snap => snap.exists())) {
          const existingIds = userSnaps.filter(snap => snap.exists()).map(snap => snap.id);
          throw new Error(
            `Профиль по ожидаемому имени/группе уже существует, но UID не совпадает или отсутствует (${existingIds.join(', ')}). ` +
            'Ничего не изменено. Проверь UID заявки и документ пользователя.'
          );
        }

        const status = String(req.status || 'pending').toLowerCase();
        let expiresAt = msOf(req.approvedExpiresAt);
        if (mode === 'approve') {
          if (status === 'rejected' || status === 'revoked') {
            throw new Error('Заявка отклонена или отозвана. Попроси пользователя отправить новую заявку.');
          }
          if (status === 'approved') {
            // Idempotent repair: do NOT add days again to an already-approved request.
            if (!expiresAt) throw new Error('Заявка уже одобрена, но approvedExpiresAt отсутствует. Исправь срок в документе заявки.');
          } else {
            const days = Math.max(1, Math.min(3650, Math.floor(Number(req.days) || 30)));
            const current = chosen && chosen.data ? chosen.data : {};
            const existingExpiry = current.premiumActive === true ? msOf(current.premiumExpiresAt) : 0;
            expiresAt = Math.max(now, existingExpiry) + days * 86400000;
          }
        } else if (mode === 'repair') {
          if (status !== 'approved') throw new Error('Восстановить профиль можно только для одобренной заявки.');
          if (!expiresAt) throw new Error('В заявке отсутствует approvedExpiresAt. Срок нельзя безопасно восстановить.');
        } else {
          throw new Error('Неизвестная операция.');
        }

        const profileRef = chosen ? chosen.ref : refs[0];
        const profileData = chosen && chosen.data ? chosen.data : {};
        const isActive = expiresAt > now;
        tx.set(profileRef, {
          name: profileData.name || req.name,
          group: profileData.group || req.group,
          uid: profileData.uid || req.uid,
          premiumActive: isActive,
          premiumExpiresAt: isActive ? expiresAt : 0,
          updatedAt: serverTimestamp()
        }, { merge: true });

        if (status !== 'approved') {
          tx.update(reqRef, {
            status: 'approved',
            approvedAt: serverTimestamp(),
            approvedExpiresAt: expiresAt,
            approvedProfileId: profileRef.id
          });
        } else if (!req.approvedProfileId) {
          tx.update(reqRef, { approvedProfileId: profileRef.id });
        }
        return { expiresAt, active: isActive, profileId: profileRef.id, alreadyApproved: status === 'approved' };
      });
      clearUserCache();
      return result;
    } finally {
      busy = false;
    }
  }

  async function rejectRequest(reqId, btn) {
    if (!confirm('Отклонить эту заявку?')) return;
    const old = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Отклоняю…'; }
    try {
      const { doc, updateDoc, serverTimestamp } = await firestore();
      const req = await getRequest(reqId);
      if (req.status === 'approved') throw new Error('Заявка уже одобрена. Используй действие отзыва в разделе «Активированные».');
      await updateDoc(doc(window.doroDb, 'payment_requests', reqId), {
        status: 'rejected', rejectedAt: serverTimestamp()
      });
      invalidateRequestCache();
      await render(true);
    } catch (e) {
      console.error('[Golden] reject:', e);
      alert('Не удалось отклонить заявку: ' + (e.message || e));
      if (btn) { btn.disabled = false; btn.textContent = old || 'Отклонить'; }
    }
  }

  async function revokeRequest(reqId, btn) {
    if (!confirm('Отозвать Golden по этой заявке? Если у пользователя есть другая действующая одобренная заявка, срок будет пересчитан по ней.')) return;
    if (btn) { btn.disabled = true; btn.textContent = 'Отзываю…'; }
    try {
      const { collection, doc, getDocs, query, where, runTransaction, serverTimestamp } = await firestore();
      const request = await getRequest(reqId);
      const refs = await getCandidateUserRefs(request);
      // Find other approved requests for the same UID; query by UID only to avoid composite-index dependency.
      let otherExpiry = 0;
      if (request.uid) {
        const snap = await getDocs(query(collection(window.doroDb, 'payment_requests'), where('uid', '==', request.uid)));
        snap.docs.forEach(d => {
          if (d.id === reqId) return;
          const r = d.data();
          if (r.status === 'approved') otherExpiry = Math.max(otherExpiry, msOf(r.approvedExpiresAt));
        });
      }
      const reqRef = doc(window.doroDb, 'payment_requests', reqId);
      await runTransaction(window.doroDb, async (tx) => {
        const reqSnap = await tx.get(reqRef);
        if (!reqSnap.exists()) throw new Error('Заявка не найдена.');
        const req = reqSnap.data();
        const userSnaps = await Promise.all(refs.map(ref => tx.get(ref)));
        const candidate = userSnaps.map((snap, i) => ({ snap, ref: refs[i], data: snap.exists() ? snap.data() : null }))
          .find(x => x.snap.exists() && isSamePerson(x.data, req));
        tx.update(reqRef, { status: 'revoked', revokedAt: serverTimestamp() });
        if (candidate) {
          const keepActive = otherExpiry > Date.now();
          tx.set(candidate.ref, {
            premiumActive: keepActive,
            premiumExpiresAt: keepActive ? otherExpiry : 0,
            updatedAt: serverTimestamp()
          }, { merge: true });
        }
      });
      clearUserCache();
      invalidateRequestCache();
      await render(true);
      alert(otherExpiry > Date.now()
        ? `Эта заявка отозвана. У пользователя сохранён другой срок Golden до ${formatDate(otherExpiry)}.`
        : 'Заявка отозвана, Golden отключён.');
    } catch (e) {
      console.error('[Golden] revoke:', e);
      alert('Не удалось отозвать Golden: ' + (e.message || e));
      if (btn) { btn.disabled = false; btn.textContent = 'Отозвать'; }
    }
  }

  function refreshButton() {
    return `<button type="button" class="admin-refresh" id="adminRefreshBtn">↻ Обновить</button>`;
  }

  async function loadByStatus(status, force = false) {
    const cached = requestCache.get(status);
    if (!force && cached && Date.now() - cached.at < REQUEST_CACHE_MS) {
      return cached.rows;
    }
    const { collection, getDocs, query, where } = await firestore();
    const snap = await getDocs(query(collection(window.doroDb, 'payment_requests'), where('status', '==', status)));
    const rows = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) =>
      msOf(b.createdAt || b.approvedAt) - msOf(a.createdAt || a.approvedAt));
    requestCache.set(status, { at: Date.now(), rows });
    return rows;
  }

  function bindRefresh() {
    const btn = $('adminRefreshBtn');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      try { invalidateRequestCache(); await render(true); } finally { if (btn.isConnected) btn.disabled = false; }
    });
  }

  async function renderRequests(force = false) {
    const panel = $('adminPanel');
    const badge = $('adminRequestsBadge');
    panel.innerHTML = `${refreshButton()}<div class="admin-empty">Загрузка заявок…</div>`;
    bindRefresh();
    try {
      const requests = await loadByStatus('pending', force);
      if (badge) {
        badge.hidden = !requests.length;
        badge.textContent = String(requests.length);
      }
      if (!requests.length) {
        panel.innerHTML = `${refreshButton()}<div class="admin-empty"><div class="admin-empty__icon">🎉</div><b>Заявок нет</b><span>Новые заявки появятся здесь.</span></div>`;
        bindRefresh(); return;
      }
      panel.innerHTML = `${refreshButton()}<div class="admin-group-title"><b>Ожидают подтверждения</b><span>${requests.length}</span></div>` +
        requests.map(r => `<article class="admin-req" data-req-id="${escapeHtml(r.id)}">
          <div class="admin-req__body">
            <div class="admin-req__name">${escapeHtml(r.name || 'Без имени')} <span class="admin-req__badge">${escapeHtml(r.group || 'Без группы')}</span></div>
            <div class="admin-req__meta"><b>${escapeHtml(r.amount == null ? 79 : r.amount)} ₽</b> · ${escapeHtml(r.days || 30)} ${pluralDays(r.days || 30)} Golden ${agoText(r.createdAt) ? '· ' + escapeHtml(agoText(r.createdAt)) : ''}</div>
            <div class="admin-req__meta">UID: <code>${escapeHtml(r.uid || 'не указан')}</code></div>
          </div>
          <div class="admin-req__actions">
            <button type="button" class="admin-btn admin-btn--approve" data-approve="${escapeHtml(r.id)}">✓ Активировать</button>
            <button type="button" class="admin-btn admin-btn--reject" data-reject="${escapeHtml(r.id)}">Отклонить</button>
          </div></article>`).join('');
      panel.querySelectorAll('[data-approve]').forEach(btn => btn.addEventListener('click', async () => {
        if (!confirm('Подтвердить оплату и активировать Golden на срок, указанный в заявке?')) return;
        btn.disabled = true; btn.textContent = 'Активирую…';
        try {
          const result = await applyRequest(btn.dataset.approve, 'approve');
          alert(result.active
            ? `Golden активирован до ${formatDate(result.expiresAt)}. Профиль: ${result.profileId}.`
            : `Заявка обработана, но срок уже истёк (${formatDate(result.expiresAt)}).`);
          invalidateRequestCache();
          await render(true);
        } catch (e) {
          console.error('[Golden] approve:', e);
          alert('Не удалось активировать Golden: ' + (e.message || e));
          btn.disabled = false; btn.textContent = '✓ Активировать';
        }
      }));
      panel.querySelectorAll('[data-reject]').forEach(btn => btn.addEventListener('click', () => rejectRequest(btn.dataset.reject, btn)));
      bindRefresh();
    } catch (e) {
      console.error('[Golden] pending list:', e);
      panel.innerHTML = `${refreshButton()}<div class="admin-empty"><b>Не удалось загрузить заявки</b><span>${escapeHtml(e.message || e)}</span><span>Проверь Firestore Rules и подключение.</span></div>`;
      bindRefresh();
    }
  }

  async function renderActivated(force = false) {
    const panel = $('adminPanel');
    const badge = $('adminRequestsBadge');
    panel.innerHTML = `${refreshButton()}<div class="admin-empty">Загрузка активированных заявок…</div>`;
    bindRefresh();
    try {
      const approved = await loadByStatus('approved', force);
      if (badge) badge.hidden = true;
      if (!approved.length) {
        panel.innerHTML = `${refreshButton()}<div class="admin-empty"><div class="admin-empty__icon">💎</div><b>Одобренных заявок нет</b></div>`;
        bindRefresh(); return;
      }
      panel.innerHTML = `${refreshButton()}<div class="admin-group-title"><b>Одобренные заявки</b><span>${approved.length}</span></div>` +
        approved.map(r => {
          const exp = msOf(r.approvedExpiresAt);
          const active = exp > Date.now();
          return `<article class="admin-req">
            <div class="admin-req__body">
              <div class="admin-req__name">${escapeHtml(r.name || 'Без имени')} <span class="admin-req__badge">${escapeHtml(r.group || 'Без группы')}</span></div>
              <div class="admin-req__meta">${active ? 'Срок до' : 'Срок истёк/не указан'} <b>${formatDate(exp)}</b> · ${escapeHtml(r.days || 30)} ${pluralDays(r.days || 30)}</div>
              <div class="admin-req__meta">UID: <code>${escapeHtml(r.uid || 'не указан')}</code></div>
              <div class="admin-req__meta">Профиль: <code>${escapeHtml(r.approvedProfileId || userDocId(r.name, r.group))}</code></div>
            </div>
            <div class="admin-req__actions">
              <button type="button" class="admin-btn admin-btn--approve" data-repair="${escapeHtml(r.id)}">Синхронизировать профиль</button>
              <button type="button" class="admin-btn admin-btn--reject" data-revoke="${escapeHtml(r.id)}">Отозвать</button>
            </div></article>`;
        }).join('');
      panel.querySelectorAll('[data-repair]').forEach(btn => btn.addEventListener('click', async () => {
        btn.disabled = true; btn.textContent = 'Проверяю…';
        try {
          const result = await applyRequest(btn.dataset.repair, 'repair');
          alert(result.active
            ? `Профиль синхронизирован. Golden действует до ${formatDate(result.expiresAt)}.`
            : `Профиль синхронизирован, но срок подписки уже истёк (${formatDate(result.expiresAt)}).`);
          invalidateRequestCache();
          await render(true);
        } catch (e) {
          console.error('[Golden] repair:', e);
          alert('Не удалось синхронизировать профиль: ' + (e.message || e));
          btn.disabled = false; btn.textContent = 'Синхронизировать профиль';
        }
      }));
      panel.querySelectorAll('[data-revoke]').forEach(btn => btn.addEventListener('click', () => revokeRequest(btn.dataset.revoke, btn)));
      bindRefresh();
    } catch (e) {
      console.error('[Golden] approved list:', e);
      panel.innerHTML = `${refreshButton()}<div class="admin-empty"><b>Не удалось загрузить одобренные заявки</b><span>${escapeHtml(e.message || e)}</span></div>`;
      bindRefresh();
    }
  }

  async function render(force = false) {
    const panel = $('adminPanel');
    if (!panel) return;
    if (!window.doroDb) {
      panel.innerHTML = '<div class="admin-empty"><b>Нет подключения к Firestore</b><span>Проверь firebase.js.</span></div>';
      return;
    }
    if (activeTab === 'activated') await renderActivated(force);
    else await renderRequests(force);
  }

  function setup() {
    if (initialized || !$('view-admin')) return;
    initialized = true;
    document.querySelectorAll('[data-admin-tab]').forEach(btn => {
      btn.addEventListener('click', async () => {
        activeTab = btn.dataset.adminTab === 'activated' ? 'activated' : 'requests';
        document.querySelectorAll('[data-admin-tab]').forEach(b => {
          b.classList.toggle('is-active', b === btn);
        });
        await render();
      });
    });
    document.querySelectorAll('a[data-view="admin"]').forEach(link => {
      link.addEventListener('click', () => setTimeout(() => render(), 150));
    });
    document.addEventListener('doro:roles-ready', () => {
      if (isAdmin()) render();
    });
    // No polling: it repeatedly reads every pending/approved request while the
    // admin page stays open. Refresh is manual, and actions refresh automatically.
    if (refreshTimer) clearInterval(refreshTimer);
    refreshTimer = null;
    render();
  }

  function isAdmin() {
    return document.documentElement.classList.contains('role-admin') ||
      (window.doroRoles && typeof window.doroRoles.isAdmin === 'function' && window.doroRoles.isAdmin());
  }
  function init() {
    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      if (isAdmin()) {
        clearInterval(timer);
        setup();
      } else if (tries >= 100) {
        clearInterval(timer);
      }
    }, 100);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
