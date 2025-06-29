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

document.addEventListener('click', (e) => {
    const menu = document.getElementById('mobile-menu');
    const toggle = document.getElementById('menu-toggle');

    const isClickInside = menu.contains(e.target) || toggle.contains(e.target);

    if (!isClickInside && menu.classList.contains('open')) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
        menu.setAttribute('aria-hidden', true);
    }
});
