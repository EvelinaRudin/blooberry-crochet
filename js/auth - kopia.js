// Registrera användare
function register() {
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;

    if (!username || !password) {
        alert('Fyll i alla fält!');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[username]) {
        alert('Användarnamnet är redan taget!');
        return;
    }

    users[username] = { password };
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registrering lyckades! Du kan nu logga in.');
}

// Logga in användare
function login() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[username] && users[username].password === password) {
        localStorage.setItem('loggedInUser', username);
        alert(`Välkommen, ${username}!`);
        window.location.reload(); // 🔁 Ladda om sidan så header uppdateras
    } else {
        alert('Fel användarnamn eller lösenord');
    }
}

