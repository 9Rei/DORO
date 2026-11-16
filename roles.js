// ============================================================
//  roles.js — определение прав пользователя (v3)
// ============================================================
(function () {
  'use strict';

  let currentRole = 'user';
  let currentSubjects = [];
  let currentDisplayName = '';
  let initRun = 0;
  let lastLoadedUid = '';
  let roleLoadPromise = null;
  const ROLE_CACHE_TTL = 6 * 60 * 60 * 1000;
  function cachedRole(uid) {
    try { const x = JSON.parse(localStorage.getItem('doro.role.v1:' + uid) || 'null');
      return x && Date.now() - x.time < ROLE_CACHE_TTL ? x : null;
    } catch (_) { return null; }
  }
  function storeRole(uid, data) { try { localStorage.setItem('doro.role.v1:' + uid, JSON.stringify({ ...data, time: Date.now() })); } catch (_) {} }

  window.doroRoles = {
    getRole: () => currentRole,
    getSubjects: () => currentSubjects,
    getDisplayName: () => currentDisplayName,
    isAdmin: () => currentRole === 'admin',
    isEditor: () => currentRole === 'editor' || currentRole === 'admin',
    canEditSubject: (subjectKey) => {
      if (currentRole === 'admin') return true;
      if (currentRole === 'editor') return currentSubjects.includes(subjectKey);
      return false;
    },
    ready: null
  };

  async function initRoles(force = false) {
    if (roleLoadPromise) return roleLoadPromise;
    const run = ++initRun;
    roleLoadPromise = (async () => {
    currentRole = 'user';
    currentSubjects = [];
    currentDisplayName = '';
    try {
      console.log('[roles] Ожидание Firebase...');
      
      // Ждём, пока появится объект doroCloud и в нём будет UID
      let waitTime = 0;
      while ((!window.doroCloud || !window.doroCloud.uid) && waitTime < 10000) {
        await new Promise(r => setTimeout(r, 100));
        waitTime += 100;
      }

      if (!window.doroCloud || !window.doroCloud.uid) {
        console.warn('[roles] Не дождались UID от Firebase. Работаем как user.');
        return;
      }

      const uid = window.doroCloud.uid;
      if (run !== initRun) return;
      const cached = !force && lastLoadedUid === uid ? cachedRole(uid) : null;
      if (cached) {
        currentRole = cached.role || 'user'; currentSubjects = Array.isArray(cached.subjects) ? cached.subjects : [];
        currentDisplayName = cached.displayName || ''; return;
      }
      console.log('[roles] Мой UID:', uid);

      if (!window.doroDb) {
        console.error('[roles] window.doroDb не найден. Проверь firebase.js');
        return;
      }

      const { getDoc, doc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      
      console.log('[roles] Запрашиваю документ /roles/' + uid);
      const roleDoc = await getDoc(doc(window.doroDb, 'roles', uid));
      if (run !== initRun) return;
      
      if (roleDoc.exists()) {
        const data = roleDoc.data();
        currentRole = data.role || 'user';
        currentSubjects = data.subjects || [];
        currentDisplayName = data.displayName || '';
        storeRole(uid, { role: currentRole, subjects: currentSubjects, displayName: currentDisplayName });
        lastLoadedUid = uid;
        console.log(`[roles] Успех! Роль: ${currentRole} (${currentDisplayName})`);
      } else {
        currentRole = 'user'; currentSubjects = []; currentDisplayName = '';
        storeRole(uid, { role: currentRole, subjects: [], displayName: '' }); lastLoadedUid = uid;
        console.log('[roles] Документ не найден. Искали ID:', uid);
      }
      
    } catch (err) {
      console.error('[roles] Ошибка:', err);
    } finally {
      if (run === initRun) {
        // Golden and staff roles are independent. Preserve Golden while refreshing staff permissions.
        document.documentElement.classList.remove('role-user', 'role-editor', 'role-admin');
        if (currentRole === 'user') {
          if (window.doroPremium && window.doroPremium.isPremiumActive()) {
            document.documentElement.classList.add('role-premium');
          } else {
            document.documentElement.classList.remove('role-premium');
            document.documentElement.classList.add('role-user');
          }
        } else {
          document.documentElement.classList.add('role-' + currentRole);
        }
        document.dispatchEvent(new CustomEvent('doro:roles-ready', {
          detail: { role: currentRole, subjects: currentSubjects }
        }));
      }
    }
    })().finally(() => { roleLoadPromise = null; });
    return roleLoadPromise;
  }

  window.addEventListener('doro:cloud-ready', (event) => {
    const uid = event && event.detail && event.detail.uid;
    if (uid && uid !== lastLoadedUid) initRoles(true);
    else initRoles(false);
  });

  // Единственный стартовый вызов: не запускаем два одинаковых getDoc при загрузке.
  window.doroRoles.ready = initRoles(false);
})();