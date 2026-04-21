
document.addEventListener('DOMContentLoaded', () => {
    const toc = document.querySelector('[data-toc]');
    if (!toc) return;

    const button = toc.querySelector('.article-toc__toggle');
    const body = toc.querySelector('.article-toc__body');

    if (!button || !body) return;

    const mobile = window.matchMedia('(max-width: 768px)');

    function setInitialState() {
        if (mobile.matches) {
            toc.classList.add('is-collapsed-mobile');
            button.setAttribute('aria-expanded', 'false');
            body.hidden = true;
        } else {
            toc.classList.remove('is-collapsed-mobile');
            toc.classList.remove('is-collapsed');
            button.setAttribute('aria-expanded', 'true');
            body.hidden = false;
        }
    }

    setInitialState();

    button.addEventListener('click', () => {
        const collapsed = body.hidden;

        body.hidden = !collapsed;
        button.setAttribute('aria-expanded', collapsed ? 'true' : 'false');

        toc.classList.toggle('is-collapsed', !collapsed);
        toc.classList.toggle('is-collapsed-mobile', !collapsed);
    });

    mobile.addEventListener('change', setInitialState);
});
