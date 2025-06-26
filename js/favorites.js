// js/favorites.js

// Wait until DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Elements for the favorites modal (both pages have this in their header)
    const openFavBtn = document.getElementById('openFavorites');
    const modal = document.getElementById('favoritesModal');
    const closeBtn = document.getElementById('closeModal');
    const favoritesList = document.getElementById('favoritesList');

    // Load existing favorites from localStorage (array of {id, name, image})
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Utility: save favorites array to localStorage
    function saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    // Utility: check if a given productId is already in favorites
    function isFavorited(productId) {
        return favorites.some(fav => fav.id === productId);
    }

    // Utility: Given a heart-icon element, toggle favorite state in storage & update icon
    function toggleFavElement(elem, productId, productName, productImage) {
        const idx = favorites.findIndex(fav => fav.id === productId);
        if (idx === -1) {
            // Add to favorites
            favorites.push({ id: productId, name: productName, image: productImage });
            elem.innerHTML = '&#9829;';             // filled heart
            elem.classList.add('favorited');
        } else {
            // Remove from favorites
            favorites.splice(idx, 1);
            elem.innerHTML = '&#9825;';             // empty heart
            elem.classList.remove('favorited');
        }
        saveFavorites();
    }

    // --------------------------
    // 1) PRODUCT DETAIL HEART
    // --------------------------
    // If on product.html, there is a <span id="favoriteIcon" …> inside the dynamically generated HTML
    const detailHeart = document.getElementById('favoriteIcon');
    if (detailHeart) {
        const productId = detailHeart.dataset.id;
        const productName = detailHeart.dataset.name || '';
        const imgElem = document.querySelector('.product-image');
        const productImg = imgElem ? imgElem.src : '';

        // Set initial heart state on detail page
        if (isFavorited(productId)) {
            detailHeart.innerHTML = '&#9829;';
            detailHeart.classList.add('favorited');
        } else {
            detailHeart.innerHTML = '&#9825;';
            detailHeart.classList.remove('favorited');
        }

        // Toggle on click
        detailHeart.addEventListener('click', () => {
            toggleFavElement(detailHeart, productId, productName, productImg);
        });
    }

    // --------------------------------
    // 2) PRODUCT GRID HEART ICONS
    // --------------------------------
    // Attach a delegated listener on the grid container so we catch all .heart-icon clicks
    const gridContainer = document.getElementById('product-grid');
    if (gridContainer) {
        // On page load: set each card’s heart icon to filled if already favorited
        const gridHearts = gridContainer.querySelectorAll('.heart-icon');
        gridHearts.forEach(elem => {
            const pid = elem.dataset.id;
            if (pid && isFavorited(pid)) {
                elem.innerHTML = '&#9829;';
                elem.classList.add('favorited');
            } else {
                elem.innerHTML = '&#9825;';
                elem.classList.remove('favorited');
            }
        });

        // Delegate click events on any heart-icon inside the grid
        gridContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('heart-icon')) {
                const elem = e.target;
                const pid = elem.dataset.id;
                // Find the name and image from within the same .product-card
                const cardElem = elem.closest('.product-card');
                const nameElem = cardElem.querySelector('h3');
                const prodName = nameElem ? nameElem.innerText.trim() : '';
                const imgElem = cardElem.querySelector('img');
                const prodImg = imgElem ? imgElem.src : '';

                if (pid) {
                    toggleFavElement(elem, pid, prodName, prodImg);
                }
            }
        });
    }

    // ------------------------------
    // 3) OPEN FAVORITES MODAL
    // ------------------------------
    openFavBtn.addEventListener('click', (e) => {
        e.preventDefault(); // prevent the "#" from scrolling the page

        // Clear existing content
        favoritesList.innerHTML = '';

        if (favorites.length === 0) {
            favoritesList.innerHTML = '<li data-i18n="favorites.none">Inga favoriter ännu.</li>';
        } else {
            favorites.forEach(fav => {
                const li = document.createElement('li');
                li.className = 'favorite-item';

                const link = document.createElement('a');
                link.href = `product.html?id=${encodeURIComponent(fav.id)}`;
                link.title = fav.name;

                if (fav.image) {
                    const thumb = document.createElement('img');
                    thumb.src = fav.image;
                    thumb.alt = fav.name;
                    thumb.className = 'favorite-thumb';
                    link.appendChild(thumb);
                }

                const nameSpan = document.createElement('span');
                nameSpan.textContent = fav.name;
                // If you want the product name to be translatable as well:
                // nameSpan.setAttribute('data-i18n', `product.${fav.id}`); (if keys like this exist)
                link.appendChild(nameSpan);

                li.appendChild(link);
                favoritesList.appendChild(li);
            });
        }


        // Show the modal
        modal.style.display = 'block';
    });

    // Close button in modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Click outside the modal content closes it
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});
