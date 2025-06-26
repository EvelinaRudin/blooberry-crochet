document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('mobile-menu');
    const toggle = document.getElementById('menu-toggle');

    // sanity-check
    console.log({ menu, toggle });
    if (!menu || !toggle) {
        console.error('Mobile menu or toggle button not found!');
        return;
    }

    toggle.addEventListener('click', () => {
        console.log('🍔 menu clicked—wasOpen:', menu.classList.contains('open'));
        const isOpen = menu.classList.toggle('open');
        console.log('→ now isOpen:', isOpen);
        toggle.setAttribute('aria-expanded', isOpen);
        menu.setAttribute('aria-hidden', !isOpen);
    });
});
