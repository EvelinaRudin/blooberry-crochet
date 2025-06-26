// js/gallery.js

document.addEventListener('DOMContentLoaded', () => {
    const thumbs = document.querySelectorAll('.gallery img');
    const lightbox = document.getElementById('lightbox');
    const lbImg = lightbox.querySelector('.lightbox-img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-nav .prev');
    const nextBtn = lightbox.querySelector('.lightbox-nav .next');

    let currentIndex = 0;
    let isLightboxOpen = false;

    function openLightbox(index) {
        // Show the lightbox and mark it open
        currentIndex = index;
        const img = thumbs[currentIndex];
        lbImg.src = img.dataset.large || img.src;
        lbImg.alt = img.alt;
        lightbox.classList.add('visible');
        lightbox.classList.remove('hidden');
        isLightboxOpen = true;
    }

    function closeLightbox() {
        // Hide the lightbox and reset state
        lightbox.classList.remove('visible');
        lightbox.classList.add('hidden');
        isLightboxOpen = false;
    }

    function showPrev(e) {
        e.stopPropagation();
        if (!isLightboxOpen) return;
        openLightbox((currentIndex - 1 + thumbs.length) % thumbs.length);
    }

    function showNext(e) {
        e.stopPropagation();
        if (!isLightboxOpen) return;
        openLightbox((currentIndex + 1) % thumbs.length);
    }

    // Thumbnail click: either open (if closed) or close (if already open)
    thumbs.forEach((thumb, index) => {
        thumb.style.cursor = 'pointer';
        thumb.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isLightboxOpen) {
                closeLightbox();
            } else {
                openLightbox(index);
            }
        });
    });

    // Close button
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });

    // Navigation buttons
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    // Anywhere outside the lightbox image or controls should close it—
    // and not open another, even if you clicked on a thumbnail underneath
    document.addEventListener('click', (e) => {
        if (
            isLightboxOpen &&
            !e.target.closest(
                '#lightbox .lightbox-img, ' +
                '#lightbox .lightbox-nav .prev, ' +
                '#lightbox .lightbox-nav .next, ' +
                '#lightbox .lightbox-close'
            )
        ) {
            closeLightbox();
            e.stopPropagation(); // prevent thumbnail click handlers from firing
        }
    }, true);

    // Prevent clicks on the image or nav buttons from bubbling up and closing it
    [lbImg, prevBtn, nextBtn].forEach(el => {
        el.addEventListener('click', e => e.stopPropagation());
    });
});
