// Spara kundvagn i localStorage

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = count;
}

// Kör på varje sida där navbar finns
document.addEventListener('DOMContentLoaded', updateCartCount);

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Lägg till produkt
// Produkter i lager för butik
const stock = {
    "Mr. Gentle Blue": 3,
    "Mr. Gentle Pink": 1,
    "Bambee": 2,
    "Heart Fairy": 2,
    "Daybear": 1
};

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

function addToCart(name, price) {
    let cart = getCart();
    const existing = cart.find(item => item.name === name);
    const maxStock = stock[name] || 0;

    if (existing) {
        if (existing.quantity < maxStock) {
            existing.quantity++;
            showToast(`${name} lades till i kundvagnen`);
        } else {
            showToast(`Endast ${maxStock} st i lager av ${name}`);
        }
    } else {
        if (maxStock > 0) {
            cart.push({ name, price, quantity: 1 });
            showToast(`${name} lades till i kundvagnen`);
        } else {
            showToast(`${name} är tyvärr slut i lager.`);
        }
    }

    saveCart(cart);
    updateCartCount();
}

// Visa kundvagn
async function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPriceEl = document.getElementById('total-price');
    if (!cartItems) return;

    const cart = getCart();
    cartItems.innerHTML = '';
    let total = 0;

    // Hämta produktdata för att hitta korrekta ID:n
    let products = [];
    try {
        const response = await fetch('data/products.json');
        if (response.ok) products = await response.json();
    } catch (e) {
        console.error('Kunde inte ladda products.json för cart-länkar', e);
    }

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        // Hitta produkt-ID via stockKey (item.name)
        const prod = products.find(p => p.stockKey === item.name);
        const prodId = prod ? prod.id : null;

        // Skapa klickbar titel om ID hittas
        const nameHTML = prodId
            ? `<a href="product.html?id=${prodId}" class="item-link">${item.name}</a>`
            : `<span class="item-name">${item.name}</span>`;

        const div = document.createElement('div');
        div.className = 'cart-item';

        div.innerHTML = `
            <div class="item-name-wrapper">
                ${nameHTML}
            </div>
            <span class="item-price">${item.price} kr</span>
            <div class="quantity-controls">
                <button onclick="decreaseQuantity(${index})">➖</button>
                <span>${item.quantity}</span>
                <button onclick="increaseQuantity(${index})">➕</button>
            </div>
            <button onclick="removeItem(${index})" class="remove-btn">❌</button>
        `;

        cartItems.appendChild(div);
    });

    totalPriceEl.textContent = total;
}

// Ändra antal varor i kassan
function increaseQuantity(index) {
    let cart = getCart();
    const item = cart[index];
    const maxStock = stock[item.name] || 1;
    if (item.quantity < maxStock) {
        item.quantity++;
        saveCart(cart);
        renderCart();
        updateCartCount();
    } else {
        showToast(`Max antal i lager: ${maxStock}`);
    }
}

function decreaseQuantity(index) {
    let cart = getCart();
    const item = cart[index];
    if (item.quantity > 1) {
        item.quantity--;
    } else {
        cart.splice(index, 1); // tar bort om 1 ➖
    }
    saveCart(cart);
    renderCart();
    updateCartCount();
}

// Ta bort vara
function removeItem(index) {
    let cart = getCart();
    const removedItem = cart[index]?.name;
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
    updateCartCount();
    if (removedItem) showToast(`${removedItem} togs bort från kundvagnen`);
}

// Checkout
async function checkout() {
    const cart = getCart();

    const response = await fetch("https://blooberry-checkout-server.onrender.com", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ cartItems: cart })
    });

    const data = await response.json();
    if (data.url) {
        window.location.href = data.url;
    } else {
        alert("Något gick fel med betalningen.");
    }
}


// Kör render direkt om vi är på cart.html
document.addEventListener("DOMContentLoaded", renderCart);

applyTranslations(currentLang);

