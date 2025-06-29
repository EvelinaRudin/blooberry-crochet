function applyTranslations(lang) {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        const translation = translations?.[lang]?.[key];

        if (translation) {
            if ('placeholder' in el) {
                el.placeholder = translation;
            } else {
                if (el.id === "login-text" && localStorage.getItem("loggedInUser")) {
                    return;
                }
                el.textContent = translation;
            }
        }
    });

    // Uppdatera språksymboler
    const nextLang = lang === "sv" ? "EN" : "SV";
    document.querySelectorAll('#lang-toggle span, #lang-toggle-mobile span').forEach(span => {
        span.textContent = nextLang;
    });

    localStorage.setItem("language", lang);
    currentLang = lang;
}

let currentLang = localStorage.getItem("language");

window.addEventListener("DOMContentLoaded", () => {
    if (currentLang) {
        applyTranslations(currentLang);
    }

    // Både desktop och mobilknappar
    const toggles = [document.getElementById("lang-toggle"), document.getElementById("lang-toggle-mobile")];
    toggles.forEach(toggle => {
        if (toggle) {
            toggle.addEventListener("click", e => {
                e.preventDefault();
                const next = currentLang === "sv" ? "en" : "sv";
                applyTranslations(next);
                toggle.querySelector("span").setAttribute("data-i18n", `nav.language`);
            });
        }
    });
});
