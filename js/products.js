// js/products.js

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById("productContainer");
    if (!container) return;

    // Show a loading message
    container.innerHTML = "<p>Laddar produktinformation...</p>";

    fetch("data/products.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok (status ${response.status})`);
            }
            return response.json();
        })
        .then(data => {
            // Get the product ID from the URL
            const productId = new URLSearchParams(window.location.search).get("id");
            if (!productId) {
                container.innerHTML = "<p>Ingen produkt angiven.</p>";
                return;
            }

            // Find the matching product
            const product = data.find(item => item.id === productId);
            if (!product) {
                container.innerHTML = "<p>Produkten hittades inte.</p>";
                return;
            }

            // Prepare image, name, price, alt text
            const imgSrc = product.image || "assets/images/placeholder.png";
            const nameKey = `product.${product.id}`;
            const nameText = translations?.[currentLang]?.[nameKey] || product.name;
            const altText = product.image
                ? nameText
                : product.name
                    ? `Ingen bild tillgänglig för ${product.name}`
                    : "Ingen bild tillgänglig";

            // Build translated color spans
            const colorSpans = (product.color || "")
                .split(" ")
                .map(c => `<span data-i18n="color.${c.toLowerCase()}">${c}</span>`)
                .join(", ");

            // Build the HTML template with data-i18n markers
            // NOTE: We added data-id and data-name to the favoriteIcon span
            const productHTML = `
        <img src="${imgSrc}" alt="${altText}" class="product-image" />
        <div class="product-info">
          <h1 data-i18n="${nameKey}">
            ${product.name}
            <span
              id="favoriteIcon"
              class="heart-icon"
              data-id="${product.id}"
              data-name="${nameText}"
            >&#9825;</span>
          </h1>
          <p>
            <strong>
              <span class="price-value">${product.price}</span>
              <span data-i18n="product.currency">kr</span>
            </strong>
          </p>
          <p>
            <span data-i18n="product.colorLabel">Färg:</span>
            ${colorSpans}
          </p>
          <button
            class="cta-button"
            data-i18n="product.add"
            onclick="addToCart('${product.stockKey}', ${product.price})"
          >
            Lägg i kundvagn
          </button>
        </div>
      `;

            // Insert main product HTML and run translations
            container.innerHTML = productHTML;
            applyTranslations(currentLang);

            // -------- VARIANT PICKER --------
            const allowedGroups = ['gentle', 'bambee'];
            const variants = data.filter(item => item.group === product.group);

            if (allowedGroups.includes(product.group) && variants.length > 1) {
                const picker = document.createElement('div');
                picker.className = 'variant-picker';

                variants.forEach(v => {
                    const btn = document.createElement('button');
                    btn.className = 'variant-btn';

                    // add an <img> thumbnail inside each button
                    const img = document.createElement('img');
                    img.src = v.image;
                    img.alt = v.color;
                    img.className = 'variant-swatch-img';
                    btn.appendChild(img);

                    // highlight current variant
                    if (v.id === productId) {
                        btn.classList.add('active');
                    }

                    btn.addEventListener('click', () => {
                        window.location.search = `?id=${v.id}`;
                    });

                    picker.appendChild(btn);
                });

                container.appendChild(picker);
            }

            // -------- RELATED PRODUCTS SECTION --------
            const relatedItems = data
                .filter(item => item.group === product.group && item.id !== productId);

            if (relatedItems.length > 0) {
                const section = document.createElement('section');
                section.className = 'related-products';

                const heading = document.createElement('h2');
                heading.setAttribute('data-i18n', 'related.title');
                heading.textContent = translations?.[currentLang]?.['related.title'] || 'You might also like';
                section.appendChild(heading);

                const grid = document.createElement('div');
                grid.className = 'related-grid';

                relatedItems.slice(0, 3).forEach(rel => {
                    const card = document.createElement('a');
                    card.href = `product.html?id=${rel.id}`;
                    card.className = 'related-card';

                    card.innerHTML = `
            <img src="${rel.image}" alt="${rel.name}" class="related-image" />
            <h3 data-i18n="product.${rel.id}">${rel.name}</h3>
            <p>
              <span class="related-price">${rel.price}</span>
              <span data-i18n="product.currency">kr</span>
            </p>
          `;
                    grid.appendChild(card);
                });

                section.appendChild(grid);
                container.insertAdjacentElement('afterend', section);
                applyTranslations(currentLang);
            }

            // Mark page as loaded for any fade-in effects
            document.body.classList.add("loaded");
        })
        .catch(error => {
            console.error("❌ Failed to load product data:", error);
            container.innerHTML = "<p>Fel: Kunde inte ladda produktinformation. Försök igen senare.</p>";
        });
});
