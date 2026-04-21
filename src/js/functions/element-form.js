(() => {
    const roots = document.querySelectorAll('.checkbox-ios');
    if (!roots.length) return; // элегантный выход, если на странице нет переключателей

    roots.forEach((root) => {
        const input  = root.querySelector('input[type="checkbox"]');
        const track  = root.querySelector('.checkbox-ios__switch') || root.querySelector('.checkbox-ios-switch');

        if (!input || !track) return; // пропускаем некорректную разметку

        // ARIA / доступность
        track.setAttribute('role', 'switch');
        track.setAttribute('aria-checked', String(input.checked));
        track.tabIndex = track.tabIndex || 0;

        const syncAria = () => track.setAttribute('aria-checked', String(input.checked));
        input.addEventListener('change', syncAria);

        // Если нет label-обёртки — делаем клик по ползунку рабочим
        const wrappedByLabel = root.tagName.toLowerCase() === 'label' ||
            root.closest('label') === root;

        if (!wrappedByLabel) {
            const toggle = () => {
                if (input.disabled) return;
                input.checked = !input.checked;
                input.dispatchEvent(new Event('change', { bubbles: true }));
            };
            track.addEventListener('click', toggle);
            track.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
            });
        }
    });
})();