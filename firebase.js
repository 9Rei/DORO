import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDocs, collection, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInAnonymously }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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
const auth = getAuth(app);

let readyResolve;
const ready = new Promise(r => { readyResolve = r; });

signInAnonymously(auth)
  .then(({ user }) => {
    window.doroCloud = {
      uid: user.uid,
      async saveProfile(p) {
        await setDoc(doc(db, 'users', user.uid), {
          name: p.name || '', status: p.status || '', group: p.group || '', 
          color: p.color || '#3b82f6', updatedAt: serverTimestamp()
        }, { merge: true });
      },
      async listUsers() {
        const snap = await getDocs(collection(db, 'users'));
        return snap.docs.map(d => ({ id: d.id, ...d.data(), updatedAt: d.data().updatedAt?.toMillis?.() || 0 }));
      }
    };
    readyResolve(window.doroCloud);
  })
  .catch(e => { console.error('Firebase auth error:', e); window.doroCloud = null; readyResolve(null); });

window.doroCloudReady = ready;
