import { auth, googleProvider } from './firebase-config.js'; // ✅ Import shared instances

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
// DOM Elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailLoginBtn = document.getElementById("email-login");
const emailSignupBtn = document.getElementById("email-signup");
const googleLoginBtn = document.getElementById("google-login-btn");
const anonymousLoginBtn = document.getElementById("anonymous-login");
const errorMessage = document.getElementById("error-message");

// Function to save user and redirect
const handleLogin = (user) => {
    localStorage.setItem("user", JSON.stringify({
        displayName: user.displayName || "",
        email: user.email || "",
    })); 
    window.location.href = "index.html"; // Redirect back
};

// 🔹 Email/Password Login
emailLoginBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        errorMessage.textContent = "⚠️ Please enter both email and password!";
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        handleLogin(userCredential.user);
    } catch (error) {
        errorMessage.textContent = getFirebaseErrorMessage(error);
    }
});

// 🔹 Email/Password Signup
emailSignupBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        errorMessage.textContent = "⚠️ Please enter both email and password!";
        return;
    }

    if (password.length < 6) {
        errorMessage.textContent = "⚠️ Password must be at least 6 characters long!";
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        handleLogin(userCredential.user);
    } catch (error) {
        errorMessage.textContent = getFirebaseErrorMessage(error);
    }
});

// 🔹 Function to translate Firebase error messages
function getFirebaseErrorMessage(error) {
    switch (error.code) {
        case "auth/invalid-email":
            return "❌ Invalid email format!";
        case "auth/user-not-found":
            return "❌ No account found with this email!";
        case "auth/wrong-password":
            return "❌ Incorrect password!";
        case "auth/email-already-in-use":
            return "⚠️ This email is already registered!";
        case "auth/weak-password":
            return "⚠️ Password must be at least 6 characters long!";
        default:
            return "⚠️ " + error.message;
    }
}


// 🔹 Google Sign-In (Force Account Selection)

document.getElementById("google-login").addEventListener("click", async () => {
    try {
        googleProvider.setCustomParameters({ prompt: "select_account" }); // Force user to choose an account

        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Save user to local storage
        localStorage.setItem("user", JSON.stringify({
            displayName: user.displayName,
            email: user.email
        }));

        // Redirect after login
        window.location.href = "index.html";
    } catch (error) {
        console.error("Google Sign-In Error:", error.message);
        alert("Google Sign-In failed: " + error.message);
    }
});

// 🔹 Anonymous Sign-In
if (anonymousLoginBtn) {
    anonymousLoginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        signInAnonymously(auth)
            .then(userCredential => handleLogin(userCredential.user))
            .catch(error => errorMessage.textContent = error.message);
    });
}
