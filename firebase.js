// ============================================================
// DORO Firebase bridge — Auth + профили + счётчик
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, collection, getCountFromServer,
  doc, setDoc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth, signInAnonymously, onAuthStateChanged,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const app = initializeApp({
  apiKey: "AIzaSyCC_iROLLuC0_Q25zY1ktzs6SoDctmF7og",
  authDomain: "doro-c27d6.firebaseapp.com",
  projectId: "doro-c27d6",
  storageBucket: "doro-c27d6.firebasestorage.app",
  messagingSenderId: "412789293265",
  appId: "1:412789293265:web:c9bf990dab8a8215d405f0"
});

const db = getFirestore(app);
const auth = getAuth(app);
window.doroDb = db;

let resolveInitialReady;
let initialReadySettled = false;
const initialReady = new Promise(resolve => { resolveInitialReady = resolve; });
window.doroCloudReady = initialReady;

function publishCloud(cloud) {
  window.doroCloud = cloud || null;
  if (!initialReadySettled) {
    initialReadySettled = true;
    resolveInitialReady(window.doroCloud);
  } else {
    window.doroCloudReady = Promise.resolve(window.doroCloud);
  }
  try {
    window.dispatchEvent(new CustomEvent('doro:cloud-ready', {
      detail: {
        uid: window.doroCloud && window.doroCloud.uid,
        isAnonymous: !!(window.doroCloud && window.doroCloud.isAnonymous)
      }
    }));
  } catch (_) {}
}

// Таймаут на случай, если Firebase не ответит
setTimeout(() => {
  if (!initialReadySettled) {
    console.warn('[firebase] Auth initialization is slow; starting in offline mode for now.');
    initialReadySettled = true;
    resolveInitialReady(null);
  }
}, 12000);

let anonymousSignInInFlight = false;
onAuthStateChanged(auth, firebaseUser => {
  if (firebaseUser) {
    publishCloud(createCloudApi(firebaseUser));
    return;
  }

  // Если пользователь уже был авторизован — не создаём анонимную сессию
  const hadAccount = localStorage.getItem('doro.hasPasswordAccount') === '1';
  if (hadAccount) {
    publishCloud(null);
    return;
  }

  if (anonymousSignInInFlight) return;
  anonymousSignInInFlight = true;
  signInAnonymously(auth).catch(error => {
    console.error('[firebase] Anonymous sign-in failed:', error);
    publishCloud(null);
  }).finally(() => { anonymousSignInInFlight = false; });
});

function createCloudApi(initialUser) {
  const normalizeLogin = value => String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();
  const currentUid = () => (auth.currentUser && auth.currentUser.uid) || initialUser.uid;

  return {
    uid: initialUser.uid,
    isAnonymous: !!initialUser.isAnonymous,

    // --- Регистрация ---
    async register(login, password) {
      const safeLogin = normalizeLogin(login);
      if (!safeLogin || !password) throw new Error('Введите логин и пароль.');
      const credential = await createUserWithEmailAndPassword(auth, `${safeLogin}@doro.local`, password);
      return credential.user.uid;
    },

    // --- Вход ---
    async login(login, password) {
      const safeLogin = normalizeLogin(login);
      if (!safeLogin || !password) throw new Error('Введите логин и пароль.');
      const credential = await signInWithEmailAndPassword(auth, `${safeLogin}@doro.local`, password);
      return credential.user.uid;
    },

    // --- Выход ---
    async logout() {
      await signOut(auth);
    },

    // --- Счётчик ---
    async countUsers() {
      const snapshot = await getCountFromServer(collection(db, 'users'));
      return snapshot.data().count;
    },

    // --- Сохранить профиль ---
    async saveProfile(data) {
      if (!currentUid()) throw new Error('Нет пользователя');
      const payload = {
        name: data.name || '',
        group: data.group || '',
        status: data.status || '',
        color: data.color || '#3b82f6',
        avatarEmoji: data.avatarEmoji || '',
        avatarFrame: data.avatarFrame || 'none',
        profileBg: data.profileBg || 'default',
        profileBadge: data.profileBadge || 'none',
        profileEffect: data.profileEffect || 'default',
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', currentUid()), payload, { merge: true });
    },

    // --- Загрузить профиль ---
    async getMyProfile() {
      if (!currentUid()) return null;
      const snap = await getDoc(doc(db, 'users', currentUid()));
      return snap.exists() ? snap.data() : null;
    },

    // --- Совместимость со старым кодом ---
    async loginOrMigrate(profileData, password) {
      const login = (profileData.name || '').toLowerCase() + '_' + (profileData.group || '').toLowerCase();
      try {
        await this.login(login, password);
        return { migrated: false, restored: true };
      } catch (e) {
        if (e.code === 'auth/user-not-found') {
          await this.register(login, password);
          await this.saveProfile(profileData);
          return { migrated: true, restored: false };
        }
        throw e;
      }
    },

    async claimIdentity(profileData) {
      try {
        await this.saveProfile(profileData);
        return { removed: 0 };
      } catch (e) {
        return { removed: 0 };
      }
    }
  };
}