import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyA-ikXEbtQ9e7Y2W1z37KF6UZLadcBrqIQ",
  authDomain: "novel-nest-82cec.firebaseapp.com",
  projectId: "novel-nest-82cec",
  storageBucket: "novel-nest-82cec.firebasestorage.app",
  messagingSenderId: "59970006158",
  appId: "1:59970006158:web:777bafb0bd530e3b7d2ddf",
  measurementId: "G-WFX2NK8K2B"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider }; // ✅ Exporting for other files
