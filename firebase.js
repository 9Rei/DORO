// ============================================================
// DORO Firebase bridge — stable auth/profile access
// Keep this file compatible with the existing classic scripts.
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, doc, setDoc, getDoc, getDocs, deleteDoc, collection,
  serverTimestamp, query, orderBy, limit, getCountFromServer, startAfter, where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth, signInAnonymously, onAuthStateChanged,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  EmailAuthProvider, linkWithCredential, signOut
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
    // If the initial timeout elapsed, let later consumers use the recovered connection.
    window.doroCloudReady = Promise.resolve(window.doroCloud);
  }
  // Roles/admin must be reloaded when Firebase changes anonymous -> real account.
  try {
    window.dispatchEvent(new CustomEvent('doro:cloud-ready', {
      detail: { uid: window.doroCloud && window.doroCloud.uid, isAnonymous: !!(window.doroCloud && window.doroCloud.isAnonymous) }
    }));
  } catch (_) {}
}

// Do not let a slow Auth startup permanently leave doroCloudReady undefined.
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
  if (anonymousSignInInFlight) return;
  anonymousSignInInFlight = true;
  signInAnonymously(auth).catch(error => {
    console.error('[firebase] Anonymous sign-in failed:', error);
    publishCloud(null);
  }).finally(() => { anonymousSignInInFlight = false; });
});

function createCloudApi(initialUser) {
  const normalizeText = value => String(value || '').trim().replace(/\s+/g, ' ');
  const normalizeLogin = value => normalizeText(value).toLowerCase();
  const currentUid = () => (auth.currentUser && auth.currentUser.uid) || initialUser.uid;

  const api = {
    uid: initialUser.uid,
    isAnonymous: !!initialUser.isAnonymous,

    _profileDocId(profile) {
      const name = normalizeLogin(profile && profile.name);
      const group = normalizeLogin(profile && profile.group);
      if (!name || !group) return null;
      return `${name}__${group}`;
    },

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

    // Existing account first; if there is no account, create one to migrate a saved local profile.
    // If creation says the email is already in use, the entered password was not accepted.
    async loginOrMigrate(profile, password) {
      const login = `${normalizeLogin(profile && profile.name)}_${normalizeLogin(profile && profile.group)}`;
      const email = `${login}@doro.local`;
      try {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        return { uid: credential.user.uid, restored: false, migrated: false };
      } catch (signInError) {
        const canTryMigration = signInError && (
          signInError.code === 'auth/user-not-found' ||
          signInError.code === 'auth/invalid-credential' ||
          signInError.code === 'auth/wrong-password'
        );
        if (!canTryMigration) throw signInError;
      }

      let created;
      try {
        created = await createUserWithEmailAndPassword(auth, email, password);
      } catch (createError) {
        if (createError && createError.code === 'auth/email-already-in-use') {
          throw new Error('Неверный пароль. Проверь логин и пароль и попробуй ещё раз.');
        }
        throw createError;
      }

      // Wait for auth state to reflect the new UID before writing the profile.
      await waitForAuthUid(created.user.uid, 5000);
      const claimResult = await api.claimIdentity(profile || {});
      return { uid: created.user.uid, restored: !!claimResult.restored, migrated: true, removed: 0 };
    },

    async linkAnonymous(login, password) {
      if (!auth.currentUser || !auth.currentUser.isAnonymous) {
        throw new Error('Текущий пользователь не анонимный');
      }
      const email = `${normalizeLogin(login)}@doro.local`;
      const credential = EmailAuthProvider.credential(email, password);
      const result = await linkWithCredential(auth.currentUser, credential);
      return result.user.uid;
    },

    async logout() {
      await signOut(auth);
    },

    async saveProfile(profile) {
      const p = profile || {};
      const id = api._profileDocId(p);
      if (!id) throw new Error('Нельзя сохранить профиль: заполните имя и группу.');

      const payload = {
        uid: currentUid(),
        name: normalizeText(p.name),
        status: p.status || '',
        group: normalizeText(p.group).toUpperCase(),
        color: p.color || '#3b82f6',
        avatarEmoji: p.avatarEmoji || '',
        avatarFrame: p.avatarFrame || 'none',
        profileBg: p.profileBg || 'default',
        profileBadge: p.profileBadge || 'none',
        profileEffect: p.profileEffect || 'default',
        updatedAt: serverTimestamp()
      };
      // Only modify Golden when the caller explicitly passes premium.
      if (p.premium && typeof p.premium === 'object') {
        payload.premiumActive = p.premium.active === true;
        payload.premiumExpiresAt = Number(p.premium.expiresAt || 0);
      }
      await setDoc(doc(db, 'users', id), payload, { merge: true });
      return { id, ...payload };
    },

    async getMyProfile(profile) {
      let p = profile;
      if (!p) {
        try { p = JSON.parse(localStorage.getItem('doro.user') || 'null'); }
        catch (_) { p = null; }
      }
      const id = api._profileDocId(p);
      if (!id) return null;
      const snapshot = await getDoc(doc(db, 'users', id));
      if (snapshot.exists()) return { id: snapshot.id, ...snapshot.data() };

      // Compatibility with older DORO versions that stored the group in uppercase
      // inside the document ID (name__GROUP). Do not delete the legacy record here.
      const legacyName = normalizeLogin(p && p.name);
      const legacyGroup = normalizeText(p && p.group).toUpperCase();
      const legacyId = legacyName && legacyGroup ? `${legacyName}__${legacyGroup}` : null;
      if (legacyId && legacyId !== id) {
        const legacySnapshot = await getDoc(doc(db, 'users', legacyId));
        if (legacySnapshot.exists()) return { id: legacySnapshot.id, ...legacySnapshot.data(), _legacyId: legacySnapshot.id };
      }
      return null;
    },

    async listAllUsers(pageSize = 300) {
      const size = Math.max(1, Math.min(Number(pageSize) || 300, 500));
      const all = [];
      let lastDoc = null;
      while (true) {
        // Avoid orderBy(updatedAt): older documents without that field were silently omitted.
        const parts = [collection(db, 'users')];
        if (lastDoc) parts.push(startAfter(lastDoc));
        parts.push(limit(size));
        const snapshot = await getDocs(query(...parts));
        if (snapshot.empty) break;
        snapshot.docs.forEach(d => {
          const data = d.data();
          all.push({ id: d.id, ...data, updatedAt: data.updatedAt && data.updatedAt.toMillis ? data.updatedAt.toMillis() : 0 });
        });
        lastDoc = snapshot.docs[snapshot.docs.length - 1];
        if (snapshot.size < size) break;
      }
      return all;
    },

    async listUsersSince(sinceTimestamp) {
      const sinceDate = new Date(Number(sinceTimestamp) || 0);
      const snapshot = await getDocs(query(collection(db, 'users'), where('updatedAt', '>', sinceDate)));
      return snapshot.docs.map(d => {
        const data = d.data();
        return { id: d.id, ...data, updatedAt: data.updatedAt && data.updatedAt.toMillis ? data.updatedAt.toMillis() : 0 };
      });
    },

    async countUsers() {
      const snapshot = await getCountFromServer(collection(db, 'users'));
      return snapshot.data().count;
    },

    async claimIdentity(profile) {
      const p = profile || {};
      // Preserve cloud profile fields (especially Golden) when linking an old/anonymous login.
      const existing = await api.getMyProfile(p).catch(() => null);
      const payload = { ...(existing || {}), ...p };
      if (existing && Object.prototype.hasOwnProperty.call(existing, 'premiumActive') && !p.premium) {
        payload.premium = {
          active: existing.premiumActive === true,
          expiresAt: Number(existing.premiumExpiresAt || 0)
        };
      }
      await api.saveProfile(payload);
      return { removed: 0, kept: api._profileDocId(p), restored: !!existing };
    },

    async deleteUserDoc(documentId) {
      if (!documentId) return;
      await deleteDoc(doc(db, 'users', String(documentId)));
    },

    // Deliberately read-only: automatic duplicate cleanup can destroy legacy profiles/subscriptions.
    async cleanupAllDuplicates() {
      const all = await api.listAllUsers(300);
      const normalize = value => normalizeLogin(value);
      const seen = new Map();
      const duplicates = [];
      for (const record of all) {
        const key = `${normalize(record.name)}::${normalize(record.group)}`;
        if (key === '::') continue;
        if (seen.has(key)) duplicates.push({ key, ids: [seen.get(key), record.id] });
        else seen.set(key, record.id);
      }
      return { removed: 0, duplicates, kept: [...seen.values()] };
    }
  };

  return api;
}

function waitForAuthUid(uid, timeoutMs) {
  if (auth.currentUser && auth.currentUser.uid === uid) return Promise.resolve();
  return new Promise(resolve => {
    let done = false;
    const timer = setTimeout(finish, timeoutMs);
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user && user.uid === uid) finish();
    });
    function finish() {
      if (done) return;
      done = true;
      clearTimeout(timer);
      unsubscribe();
      resolve();
    }
  });
}
