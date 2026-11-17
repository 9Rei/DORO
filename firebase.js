// ============================================================
// DORO Firebase bridge — Auth + профили + счётчик
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, collection, getCountFromServer,
  doc, setDoc, getDoc,
  query, where, getDocs
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

setTimeout(() => {
  if (!initialReadySettled) {
    console.warn('[firebase] Auth initialization is slow; starting in offline mode for now.');
    initialReadySettled = true;
    resolveInitialReady(null);
  }
}, 15000);

let anonymousSignInInFlight = false;
onAuthStateChanged(auth, firebaseUser => {
  if (firebaseUser) {
    publishCloud(createCloudApi(firebaseUser));
    return;
  }

  // Убрали проверку hadAccount. Теперь всегда пытаемся войти анонимно.
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

    async register(login, password) {
      const safeLogin = normalizeLogin(login);
      if (!safeLogin || !password) throw new Error('Введите логин и пароль.');
      const credential = await createUserWithEmailAndPassword(auth, `${safeLogin}@doro.local`, password);
      return credential.user.uid;
    },

    async login(login, password) {
      const safeLogin = normalizeLogin(login);
      if (!safeLogin || !password) throw new Error('Введите логин и пароль.');
      const credential = await signInWithEmailAndPassword(auth, `${safeLogin}@doro.local`, password);
      return credential.user.uid;
    },

    async logout() {
      await signOut(auth);
    },

    async countUsers() {
      const snapshot = await getCountFromServer(collection(db, 'users'));
      return snapshot.data().count;
    },

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
        // Сохраняем подписку (если она есть в переданных данных)
        premiumActive: !!data.premiumActive,
        premiumExpiresAt: data.premiumExpiresAt || 0,
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', currentUid()), payload, { merge: true });
    },

    // Загрузить профиль (УМНЫЙ ПОИСК: по UID, затем по Имени и Группе)
    async getMyProfile(data = null) {
      if (!currentUid()) return null;
      
      // 1. Ищем по текущему UID
      const snap = await getDoc(doc(db, 'users', currentUid()));
      if (snap.exists()) return snap.data();

      // 2. Если по UID нет — ищем по Имени и Группе (если они переданы)
      if (data && data.name && data.group) {
        try {
          const usersRef = collection(db, 'users');
          const q = query(
            usersRef,
            where('name', '==', data.name),
            where('group', '==', data.group)
          );
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            // Нашли старый профиль! 
            const oldDoc = querySnapshot.docs[0];
            const oldProfile = oldDoc.data();
            
            // Привязываем старый профиль к новому UID (перезаписываем)
            await this.saveProfile(oldProfile); 
            
            return oldProfile;
          }
        } catch (e) {
          console.warn('Ошибка поиска по имени/группе:', e);
        }
      }
      
      return null; // Профиль нигде не найден
    }
  };
}