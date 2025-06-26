// auth.js
/** 
 * Initializes Firebase Auth UI:
 * - Wires up “Sign In with Google” button
 * - Wires up “Sign Out” button
 * - Listens for auth state changes and updates the header UI
 */
export function initAuthUI(auth, GoogleAuthProvider, signInWithPopup, signOutFn, onAuthStateChanged) {
    // 1) Grab UI elements (place these in your header-auth.js or inline)
    const signInBtn = document.getElementById("btn-signin");
    const signOutBtn = document.getElementById("btn-signout");
    const userPic = document.getElementById("user-pic");
    const userName = document.getElementById("user-name");

    // 2) Set up the Google provider
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    // 3) Sign-in handler
    signInBtn.addEventListener("click", () => {
        signInWithPopup(auth, provider)
            .catch(err => console.error("Google Sign-In error:", err));
    });

    // 4) Sign-out handler
    signOutBtn.addEventListener("click", () => {
        signOutFn(auth)
            .catch(err => console.error("Sign-Out error:", err));
    });

    // 5) Listen for auth state changes
    onAuthStateChanged(auth, user => {
        if (user) {
            // User is signed in
            signInBtn.style.display = "none";
            signOutBtn.style.display = "inline-block";
            userPic.src = user.photoURL || "";
            userName.textContent = user.displayName || user.email;
        } else {
            // No user
            signInBtn.style.display = "inline-block";
            signOutBtn.style.display = "none";
            userPic.src = "";
            userName.textContent = "";
        }
    });
}
