document.addEventListener('DOMContentLoaded', () => {
    const accordions = document.querySelectorAll('.accordion');

    accordions.forEach((accordion, index) => {
        const control = accordion.querySelector('.accordion__control');
        const content = accordion.querySelector('.accordion__content');

        if (!control || !content) return;

        const contentId = content.id || `accordion-content-${index + 1}`;
        const controlId = control.id || `accordion-control-${index + 1}`;

        content.id = contentId;
        control.id = controlId;

        control.setAttribute('aria-controls', contentId);
        content.setAttribute('aria-labelledby', controlId);

        const isOpen = accordion.classList.contains('is-open');

        control.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        content.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

        if (isOpen) {
            content.style.maxHeight = content.scrollHeight + 'px';
        } else {
            content.style.maxHeight = null;
        }

        control.addEventListener('click', () => {
            const opened = accordion.classList.contains('is-open');

            accordion.classList.toggle('is-open', !opened);
            control.setAttribute('aria-expanded', String(!opened));
            content.setAttribute('aria-hidden', String(opened));

            if (!opened) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    window.addEventListener('resize', () => {
        document.querySelectorAll('.accordion.is-open .accordion__content').forEach((content) => {
            content.style.maxHeight = content.scrollHeight + 'px';
        });
    });
});