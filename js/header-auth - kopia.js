document.addEventListener('DOMContentLoaded', () => {
    const user = localStorage.getItem('loggedInUser');
    const loginLink = document.getElementById('login-link');
    const loginText = document.getElementById('login-text');

    if (user && loginLink && loginText) {
        loginText.textContent = `(${user})`;
        loginLink.href = "#";
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('loggedInUser');
            location.reload();
        });
    }
});
