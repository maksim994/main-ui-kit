document.addEventListener('DOMContentLoaded', () => {
    const footerMenus = document.querySelectorAll('[data-footer-menu]');

    if (!footerMenus.length) return;

    const mobileMedia = window.matchMedia('(max-width: 991px)');

    function setInitialState(menu) {
        const body = menu.querySelector('.footer-menu__body');
        const toggle = menu.querySelector('.footer-menu__toggle');

        if (!body || !toggle) return;

        const isMobile = mobileMedia.matches;
        const isOpen = menu.classList.contains('is-open');

        if (isMobile) {
            body.style.maxHeight = isOpen ? `${body.scrollHeight}px` : '0px';
            toggle.setAttribute('aria-expanded', String(isOpen));
        } else {
            body.style.maxHeight = '';
            toggle.setAttribute('aria-expanded', 'true');
        }
    }

    function closeOthers(currentMenu) {
        if (!mobileMedia.matches) return;

        footerMenus.forEach((menu) => {
            if (menu === currentMenu) return;

            const body = menu.querySelector('.footer-menu__body');
            const toggle = menu.querySelector('.footer-menu__toggle');

            menu.classList.remove('is-open');

            if (body) body.style.maxHeight = '0px';
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
    }

    footerMenus.forEach((menu, index) => {
        const head = menu.querySelector('.footer-menu__head');
        const toggle = menu.querySelector('.footer-menu__toggle');
        const body = menu.querySelector('.footer-menu__body');

        if (!head || !toggle || !body) return;

        const bodyId = body.id || `footer-menu-body-${index + 1}`;
        body.id = bodyId;
        toggle.setAttribute('aria-controls', bodyId);

        setInitialState(menu);

        head.addEventListener('click', (event) => {
            if (!mobileMedia.matches) return;
            if (!event.target.closest('.footer-menu__toggle')) return;

            event.preventDefault();

            const isOpen = menu.classList.contains('is-open');

            closeOthers(menu);

            menu.classList.toggle('is-open', !isOpen);
            body.style.maxHeight = !isOpen ? `${body.scrollHeight}px` : '0px';
            toggle.setAttribute('aria-expanded', String(!isOpen));
        });
    });

    window.addEventListener('resize', () => {
        footerMenus.forEach((menu) => setInitialState(menu));
    });
});