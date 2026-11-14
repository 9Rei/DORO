import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDocs, deleteDoc, collection, serverTimestamp, query, orderBy, limit, getCountFromServer }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth, signInAnonymously, onAuthStateChanged,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  EmailAuthProvider, linkWithCredential, signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Твои реальные ключи из Firebase
const app = initializeApp({
  apiKey: "AIzaSyCC_iROLLuC0_Q25zY1ktzs6SoDctmF7og",
  authDomain: "doro-c27d6.firebaseapp.com",
  projectId: "doro-c27d6",
  storageBucket: "doro-c27d6.firebasestorage.app",
  messagingSenderId: "412789293265",
  appId: "1:412789293265:web:c9bf990dab8a8215d405f0"
});

const db = getFirestore(app);
window.doroDb = db; // Экспортируем db для других скриптов (например, roles.js)
const auth = getAuth(app);

let readyResolve;
const ready = new Promise(r => { readyResolve = r; });

// Страховка: если через 8 сек ничего не произошло — резолвим null,
// чтобы script.js всё равно показал окно регистрации
const fallbackTimer = setTimeout(() => {
  if (!window.doroCloudReady) {
    console.warn('[firebase] Таймаут инициализации — offline-режим');
    window.doroCloud = null;
    window.doroCloudReady = Promise.resolve(null);
    readyResolve(null);
  }
}, 8000);

// Ждём, пока Firebase определит текущего пользователя
onAuthStateChanged(auth, (firebaseUser) => {
  clearTimeout(fallbackTimer);
  if (firebaseUser) {
    initCloud(firebaseUser);
  } else {
    // Нет активного пользователя — создаём анонимного (для старых юзеров)
    signInAnonymously(auth).catch(e => {
      console.error('Anonymous auth error:', e);
      window.doroCloud = null;
      window.doroCloudReady = Promise.resolve(null);   // ← КРИТИЧНО
      readyResolve(null);
    });
  }
});

function initCloud(user) {
  window.doroCloud = {
    uid: user.uid,
    isAnonymous: !!user.isAnonymous,

    async register(login, password) {
      // login уже должен быть нормализован: "антон_лд2511"
      const email = `${login}@doro.local`;
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
      return newUser.uid;
    },

    async login(login, password) {
      const email = `${login}@doro.local`;
      const { user: loggedUser } = await signInWithEmailAndPassword(auth, email, password);
      return loggedUser.uid;
    },

    // Вход с автоматической миграцией старого анонимного профиля:
    // - если email уже создан — обычный вход;
    // - если нет — создаём пароль для текущего uid + claimIdentity переносит данные.
    async loginOrMigrate(profile, password) {
      const login = (profile.name.toLowerCase() + '_' + profile.group.toLowerCase());
      const email = `${login}@doro.local`;

      try {
        const { user: loggedUser } = await signInWithEmailAndPassword(auth, email, password);
        return { uid: loggedUser.uid, restored: false, migrated: false };
      } catch (err) {
        if (err.code !== 'auth/user-not-found' && err.code !== 'auth/invalid-credential') {
          throw err;
        }
      }

      let newUid;
      try {
        const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
        newUid = newUser.uid;
      } catch (err) {
        if (err.code === 'auth/email-already-in-use') {
          throw new Error('Этот логин уже занят другим пользователем. Если это вы — введите правильный пароль.');
        }
        throw err;
      }

      const claimResult = await window.doroCloud.claimIdentity(profile);
      return {
        uid: newUid,
        restored: !!claimResult.restored,
        migrated: true,
        removed: claimResult.removed
      };
    },

    async linkAnonymous(login, password) {
      // Для старых пользователей: привязать текущий анонимный uid к email/паролю
      if (!auth.currentUser || !auth.currentUser.isAnonymous) {
        throw new Error('Текущий пользователь не анонимный');
      }
      const email = `${login}@doro.local`;
      const credential = EmailAuthProvider.credential(email, password);
      await linkWithCredential(auth.currentUser, credential);
      return auth.currentUser.uid;
    },

    async logout() {
      await signOut(auth);
    },

    // Детерминированный ID: "имя__ГРУППА" в нижнем регистре.
    // Один человек = один документ, независимо от количества uid.
    _profileDocId(p) {
      const norm = (s) => (s || '').trim().replace(/\s+/g, ' ').toLowerCase();
      const name = norm(p && p.name);
      const group = norm(p && p.group); // <-- ИСПРАВЛЕНО (всё в нижнем регистре)
      if (!name || !group) return null;
      return `${name}__${group}`;
    },

    async saveProfile(p) {
      const id = window.doroCloud._profileDocId(p);
      if (!id) { console.warn('saveProfile: нет имени или группы — пропускаю'); return; }

      const payload = {
        uid: window.doroCloud.uid,
        name: p.name || '',
        status: p.status || '',
        group: (p.group || '').trim().toUpperCase(),
        color: p.color || '#3b82f6',
        avatarEmoji: p.avatarEmoji || '',
        avatarFrame: p.avatarFrame || 'none',
        profileBg: p.profileBg || 'default',
        profileBadge: p.profileBadge || 'none',
        profileEffect: p.profileEffect || 'default',
        updatedAt: serverTimestamp()
      };

      // Премиум пишем только когда он явно передан (чтобы обычное сохранение не сбрасывало)
      if (p.premium && typeof p.premium === 'object') {
        payload.premiumActive = !!p.premium.active;
        payload.premiumExpiresAt = p.premium.expiresAt || 0;
      }

      await setDoc(doc(db, 'users', id), payload, { merge: true });
    },

    async getMyProfile(profile) {
      const { getDoc, doc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      const p = profile || (() => {
        try { return JSON.parse(localStorage.getItem('doro.user') || 'null'); }
        catch (e) { return null; }
      })();
      const id = window.doroCloud._profileDocId(p);
      if (!id) return null;
      const snap = await getDoc(doc(db, 'users', id));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    },

    async listAllUsers(pageSize = 500) {
      const { startAfter, getDocs: getDocsAll, query: queryAll, orderBy: orderByAll, limit: limitAll } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      const all = [];
      let lastDoc = null;
      while (true) {
        let q;
        if (lastDoc) {
          q = queryAll(collection(db, 'users'), orderByAll('updatedAt', 'desc'), startAfter(lastDoc), limitAll(pageSize));
        } else {
          q = queryAll(collection(db, 'users'), orderByAll('updatedAt', 'desc'), limitAll(pageSize));
        }
        const snap = await getDocsAll(q);
        if (snap.empty) break;
        snap.docs.forEach(d => {
          all.push({ id: d.id, ...d.data(), updatedAt: d.data().updatedAt?.toMillis?.() || 0 });
        });
        lastDoc = snap.docs[snap.docs.length - 1];
        if (snap.docs.length < pageSize) break;
      }
      return all;
    },

    async listUsersSince(sinceTimestamp) {
      const { where, query: q, collection: col, getDocs: gd } = await import(
        "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
      );
      const sinceDate = new Date(sinceTimestamp || 0);

      const qq = q(
        col(db, 'users'),
        where('updatedAt', '>', sinceDate)
      );

      const snap = await gd(qq);
      return snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          updatedAt: data.updatedAt?.toMillis?.() || 0
        };
      });
    },

    async countUsers() {
      const snap = await getCountFromServer(collection(db, 'users'));
      return snap.data().count;
    },

    async claimIdentity(profile) {
      // Дубликатов больше нет: ID документа детерминирован (name__group).
      // Firestore физически не даст создать второй документ с тем же ID.
      // Метод оставлен для совместимости со старым кодом (script.js его ещё вызывает).
      await window.doroCloud.saveProfile(profile);
      return {
        removed: 0,
        kept: window.doroCloud._profileDocId(profile),
        restored: null
      };
    },
    async deleteUserDoc(uid) {
      await deleteDoc(doc(db, 'users', uid));
    },

    async cleanupAllDuplicates() {
      const all = await window.doroCloud.listAllUsers(500);
      const norm = (s) => (s || '').trim().replace(/\s+/g, ' ').toLowerCase();
      const seen = new Map();   // key = name::group → best record
      const toDelete = [];
      const myUid = user.uid;   // текущий пользователь — не трогаем

      // Сортируем: у кого updatedAt больше — тот «главный»
      all.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

      for (const u of all) {
        const nameKey = norm(u.name);
        if (!nameKey) continue;
        const key = nameKey + '::' + (u.group || '').trim().toUpperCase();

        // Текущий пользователь всегда «главный» для своей пары name::group
        if (u.id === myUid) { seen.set(key, u); continue; }

        if (!seen.has(key)) {
          seen.set(key, u);
        } else {
          toDelete.push(u.id);
        }
      }

      for (const id of toDelete) {
        try { await deleteDoc(doc(db, 'users', id)); }
        catch (e) { console.warn('cleanup delete failed:', id, e); }
      }
      return { removed: toDelete.length, kept: [...seen.values()].map(u => u.id) };
    }
  };

  // Сообщаем всем, что cloud готов
  window.doroCloudReady = Promise.resolve(window.doroCloud);
  readyResolve(window.doroCloud);
}