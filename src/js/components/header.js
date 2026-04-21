document.addEventListener('DOMContentLoaded', () => {
    initHeaderPhone();
    initHeaderSearch();
    initHeaderSticky();
});

function initHeaderPhone() {
    document.querySelectorAll('.header-phone').forEach((phone) => {
        const trigger = phone.querySelector('.header-phone__trigger');
        const dropdown = phone.querySelector('.header-phone__dropdown');

        if (!trigger || !dropdown) return;

        trigger.addEventListener('click', (event) => {
            event.stopPropagation();
            phone.classList.toggle('is-open');
        });

        document.addEventListener('click', (event) => {
            if (!phone.contains(event.target)) {
                phone.classList.remove('is-open');
            }
        });
    });
}

function initHeaderSearch() {
    const openButtons = document.querySelectorAll('.js-header-search-btn');

    openButtons.forEach((button) => {
        const header = button.closest('.header');
        const search = header?.querySelector('.header-search--overlay');

        if (!search) return;

        button.addEventListener('click', () => {
            search.classList.toggle('is-open');
        });
    });
}

function initHeaderSticky() {
    const headers = document.querySelectorAll('.js-header');

    if (!headers.length) return;

    window.addEventListener('scroll', () => {
        headers.forEach((header) => {
            if (window.scrollY > 10) {
                header.classList.add('is-fixed');
            } else {
                header.classList.remove('is-fixed');
            }
        });
    });
}