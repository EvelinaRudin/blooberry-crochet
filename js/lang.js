function applyTranslations(lang) {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        const translation = translations?.[lang]?.[key];

        if (translation) {
            if ('placeholder' in el) {
                el.placeholder = translation;
            } else {
                // Undvik att skriva över login-text om användaren är inloggad
                if (el.id === "login-text" && localStorage.getItem("loggedInUser")) {
                    return; // behåll texten "Logga ut (användare)"
                }
                el.textContent = translation;
            }

        }
    });

    const toggleLabel = document.querySelector('#lang-toggle span');
    if (toggleLabel) {
        const nextLang = lang === "sv" ? "EN" : "SV";
        toggleLabel.textContent = nextLang;
    }

    localStorage.setItem("language", lang);
    currentLang = lang;
}

let currentLang = localStorage.getItem("language");

window.addEventListener("DOMContentLoaded", () => {
    if (currentLang) {
        applyTranslations(currentLang);
    }

    const toggle = document.getElementById("lang-toggle");
    if (toggle) {
        toggle.addEventListener("click", e => {
            e.preventDefault();

            const next = currentLang === "sv" ? "en" : "sv";
            applyTranslations(next);

            // Update the data-i18n value to the new language so it reflects properly
            toggle.querySelector("span").setAttribute("data-i18n", `nav.language`);
        });
    }
});
