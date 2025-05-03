import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyB7OA2e7AlGD1WgVlSFmNeQiHnzujaEnow",
  authDomain: "novel-nest-67597.firebaseapp.com",
  projectId: "novel-nest-67597",
  storageBucket: "novel-nest-67597.firebasestorage.app",
  messagingSenderId: "12050748698",
  appId: "1:12050748698:web:412dc3ea0861a17392c8a3",
  measurementId: "G-98BHKM6X9G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider }; // ✅ Exporting for other files
