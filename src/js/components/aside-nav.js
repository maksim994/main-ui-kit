document.addEventListener('DOMContentLoaded', () => {
    const navs = document.querySelectorAll('[data-aside-nav]');

    navs.forEach((nav, navIndex) => {
        const head = nav.querySelector('.aside-nav__head');
        const toggle = nav.querySelector('.aside-nav__toggle');
        const body = nav.querySelector('.aside-nav__body');

        if (!head || !toggle || !body) return;

        const bodyId = body.id || `aside-nav-body-${navIndex + 1}`;
        body.id = bodyId;
        toggle.setAttribute('aria-controls', bodyId);

        const syncMainState = () => {
            const isOpen = nav.classList.contains('is-open');
            toggle.setAttribute('aria-expanded', String(isOpen));
            body.style.maxHeight = isOpen ? `${body.scrollHeight}px` : null;
        };

        syncMainState();

        toggle.addEventListener('click', (event) => {
            event.stopPropagation();
            nav.classList.toggle('is-open');
            syncMainState();
        });

        head.addEventListener('click', (event) => {
            if (event.target.closest('.aside-nav__toggle')) return;
            nav.classList.toggle('is-open');
            syncMainState();
        });

        const items = nav.querySelectorAll('[data-aside-item]');

        items.forEach((item, itemIndex) => {
            const itemToggle = item.querySelector(':scope > .aside-nav__item-head > .aside-nav__item-toggle');
            const sublist = item.querySelector(':scope > .aside-nav__sublist');

            if (!itemToggle || !sublist) return;

            const sublistId = sublist.id || `aside-sublist-${navIndex + 1}-${itemIndex + 1}`;
            sublist.id = sublistId;
            itemToggle.setAttribute('aria-controls', sublistId);

            const syncItemState = () => {
                const isOpen = item.classList.contains('is-open');
                itemToggle.setAttribute('aria-expanded', String(isOpen));
            };

            syncItemState();

            itemToggle.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();

                item.classList.toggle('is-open');
                syncItemState();

                if (nav.classList.contains('is-open')) {
                    body.style.maxHeight = `${body.scrollHeight}px`;
                }
            });
        });
    });

    window.addEventListener('resize', () => {
        document.querySelectorAll('.aside-nav.is-open .aside-nav__body').forEach((body) => {
            body.style.maxHeight = `${body.scrollHeight}px`;
        });
    });
});