document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.js-slider');

    sliders.forEach((slider, index) => {
        if (slider.swiper) return;

        const shell = slider.closest('.swiper-shell');
        let options = {};

        try {
            options = slider.dataset.swiper ? JSON.parse(slider.dataset.swiper) : {};
        } catch (error) {
            console.error('Invalid data-swiper JSON:', error);
            options = {};
        }

        if (shell && options.pagination?.el) {
            const paginationEl = shell.querySelector(options.pagination.el);
            if (paginationEl) {
                options.pagination.el = paginationEl;
                shell.classList.add('has-pagination');
            }
        }

        if (shell && options.navigation) {
            if (options.navigation.nextEl) {
                const nextEl = shell.querySelector(options.navigation.nextEl);
                if (nextEl) options.navigation.nextEl = nextEl;
            }

            if (options.navigation.prevEl) {
                const prevEl = shell.querySelector(options.navigation.prevEl);
                if (prevEl) options.navigation.prevEl = prevEl;
            }
        }

        const swiper = new Swiper(slider, {
            slidesPerView: 1,
            spaceBetween: 12,
            loop: false,
            watchOverflow: true,
            a11y: {
                enabled: true,
            },
            ...options,
        });

        slider.dataset.swiperIndex = String(index);
        slider._swiperInstance = swiper;
    });
});