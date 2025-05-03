// Import Firebase modules with modular API
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth, GoogleAuthProvider, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

// Firebase initialization
const firebaseConfig = {
    apiKey: "AIzaSyB7OA2e7AlGD1WgVlSFmNeQiHnzujaEnow",
    authDomain: "novel-nest-67597.firebaseapp.com",
    projectId: "novel-nest-67597",
    storageBucket: "novel-nest-67597.firebasestorage.app",
    messagingSenderId: "12050748698",
    appId: "1:12050748698:web:412dc3ea0861a17392c8a3",
    measurementId: "G-98BHKM6X9G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Function to handle sign out
function handleSignOut() {
    const logoutButton = document.getElementById("logout-btn");
    if (logoutButton) {
        logoutButton.addEventListener("click", async () => {
            try {
                await signOut(auth);
                localStorage.removeItem("user");
                resetNavbar();
                window.location.href = "index.html"; // Redirect to home
            } catch (error) {
                console.error("Logout Error:", error.message);
            }
        });
    }
}

// Event listener for DOM content loaded
document.addEventListener("DOMContentLoaded", () => {
    const signInButton = document.getElementById("sign-in-btn");

    if (signInButton) {
        signInButton.addEventListener("click", redirectToLogin);
    }

    // Firebase Auth Listener
    onAuthStateChanged(auth, (user) => {
        if (user) {
            updateNavbar(user);
            localStorage.setItem("user", JSON.stringify({ displayName: user.displayName, email: user.email }));
            handleSignOut();
        } else {
            localStorage.removeItem("user");
            resetNavbar();
        }
    });

    // Check localStorage (fallback)
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        updateNavbar(user);
    }
});

// Function to update navbar after login
function updateNavbar(user) {
    const signInButton = document.getElementById("sign-in-btn");

    if (!signInButton) {
        console.error("Sign-in button not found!");
        return;
    }

    // Change button to user's initials
    signInButton.textContent = user.displayName ? user.displayName[0].toUpperCase() : "G";
    signInButton.classList.add("user-initials");

    // Remove old event & add dropdown event
    signInButton.removeEventListener("click", redirectToLogin);
    signInButton.addEventListener("click", toggleLogoutMenu);
}

// Function to reset navbar after logout
function resetNavbar() {
    const signInButton = document.getElementById("sign-in-btn");
    if (signInButton) {
        signInButton.textContent = "Sign In";
        signInButton.classList.remove("user-initials");
        signInButton.addEventListener("click", redirectToLogin);
    }
}

// Function to toggle logout menu with inline CSS
function toggleLogoutMenu(event) {
    let logoutMenu = document.getElementById("logout-menu");

    if (!logoutMenu) {
        logoutMenu = document.createElement("div");
        logoutMenu.id = "logout-menu";

        // Apply inline CSS styles
        logoutMenu.style.position = "absolute";
        logoutMenu.style.background = "#222";
        logoutMenu.style.border = "1px solid #ff3333";
        logoutMenu.style.padding = "10px";
        logoutMenu.style.borderRadius = "5px";
        logoutMenu.style.width = "350px";
        logoutMenu.style.textAlign = "center";
        logoutMenu.style.boxShadow = "0px 4px 10px rgba(255, 51, 51, 0.3)";
        logoutMenu.style.fontFamily = "Arial, sans-serif";
        logoutMenu.style.color = "#ff9999";
        logoutMenu.style.fontSize = "14px";
        logoutMenu.style.zIndex = "1000";

        logoutMenu.innerHTML = `
            <p style="margin: 5px 0;">${auth.currentUser?.email || "Guest User"}</p>
            <button id="logout-btn" style="
                background: #ff3333;
                color: white;
                border: none;
                padding: 5px 10px;
                cursor: pointer;
                border-radius: 3px;
                font-size: 14px;
                width: 100%;
                margin-top: 5px;
            ">Logout</button>
        `;

        document.body.appendChild(logoutMenu);
    }

    // Positioning the Dropdown Just Below the Sign-in Button
    const buttonRect = event.target.getBoundingClientRect();
    logoutMenu.style.top = `${buttonRect.bottom + 5}px`; // 5px gap below button
    logoutMenu.style.left = `${buttonRect.left - 50}px`;

    logoutMenu.classList.toggle("show");
}

// Delegated event listener for logout button
document.body.addEventListener("click", async (event) => {
    if (event.target && event.target.id === "logout-btn") {
        try {
            await signOut(auth);
            localStorage.removeItem("user");
            resetNavbar();
            window.location.href = "index.html"; // Redirect to home
        } catch (error) {
            console.error("Logout Error:", error.message);
        }
    }
});

// Redirect to login page
function redirectToLogin() {
    window.location.href = "login.html";
}

// Slideshow functionality
document.addEventListener("DOMContentLoaded", () => {
    const sliderWrapper = document.querySelector("#custom-slider");
    const slides = document.querySelectorAll(".slider-item");
    let currentIndex = 0;
    const totalSlides = slides.length;
    let direction = 1; // 1 for forward, -1 for backward

    // Function to move to the next slide
    function moveToNextSlide() {
        currentIndex += direction;

        // Reverse direction at the edges
        if (currentIndex === totalSlides - 1) {
            direction = -1; // Move backward
        } else if (currentIndex === 0) {
            direction = 1; // Move forward
        }

        const offset = -currentIndex * 100; // Calculate offset based on slide index
        sliderWrapper.style.transform = `translateX(${offset}%)`;
    }

    // Automatically change slides every second
    setInterval(moveToNextSlide, 3000);
});

// PDF access control based on login status
document.addEventListener("DOMContentLoaded", () => {
    const cardLinks = document.querySelectorAll(".card a");

    // Firebase Auth Listener
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is logged in, enable access to PDFs
            localStorage.setItem("user", JSON.stringify({ displayName: user.displayName, email: user.email }));
            enableCardLinks(); // Enable links for logged-in users
        } else {
            // User is not logged in, restrict access
            localStorage.removeItem("user");
            disableCardLinks(); // Restrict access to links
        }
    });

    // Fallback for localStorage (if the user refreshes the page)
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        enableCardLinks();
    } else {
        disableCardLinks();
    }

    // Function to enable card links (for logged-in users)
    function enableCardLinks() {
        cardLinks.forEach((link) => {
            const newLink = link.cloneNode(true); // Clone the element
            link.replaceWith(newLink); // Replace old element with new one (removes event listeners)
            newLink.target = "_blank"; // Open in a new tab
        });
    }

    // Function to disable card links (for unauthenticated users)
    function disableCardLinks() {
        cardLinks.forEach((link) => {
            link.addEventListener("click", redirectToLogin); // Add redirect listener
            link.target = ""; // Prevent opening in a new tab
        });
    }

    // Redirect to login page if not logged in
    function redirectToLogin(event) {
        event.preventDefault();
        alert("Please log in to access this content!");
        window.location.href = "login.html"; // Redirect to the login page
    }
});
