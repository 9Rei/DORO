// ============================================================
//  roles.js — определение прав пользователя (v3)
// ============================================================
(function () {
  'use strict';

  let currentRole = 'user';
  let currentSubjects = [];
  let currentDisplayName = '';

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

  async function initRoles() {
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
      console.log('[roles] Мой UID:', uid); // <-- ВОТ ОН, СВЕРЬ ЕГО С БАЗОЙ!

      if (!window.doroDb) {
        console.error('[roles] window.doroDb не найден. Проверь firebase.js');
        return;
      }

      const { getDoc, doc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      
      console.log('[roles] Запрашиваю документ /roles/' + uid);
      const roleDoc = await getDoc(doc(window.doroDb, 'roles', uid));
      
      if (roleDoc.exists()) {
        const data = roleDoc.data();
        currentRole = data.role || 'user';
        currentSubjects = data.subjects || [];
        currentDisplayName = data.displayName || '';
        console.log(`[roles] Успех! Роль: ${currentRole} (${currentDisplayName})`);
      } else {
        console.log('[roles] Документ не найден. Искали ID:', uid);
      }
      
    } catch (err) {
      console.error('[roles] Ошибка:', err);
    } finally {
      document.documentElement.classList.remove('role-user', 'role-editor', 'role-premium', 'role-admin');
      document.documentElement.classList.add('role-' + currentRole);
      document.dispatchEvent(new CustomEvent('doro:roles-ready', { 
        detail: { role: currentRole, subjects: currentSubjects } 
      }));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRoles);
  } else {
    initRoles();
  }

  window.doroRoles.ready = initRoles();
})();