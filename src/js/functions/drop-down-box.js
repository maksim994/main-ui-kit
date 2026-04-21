function expandBlock() {
    const boxes = document.querySelectorAll('.js-drop-down-box');

    boxes.forEach((box) => {
        const content = box.querySelector('.drop-down-box__content');
        if (!content) {
            box.insertAdjacentHTML('afterbegin', '<span class="error">Нечего разворачивать!</span>');
            return;
        }

        const divider = box.querySelector('.drop-down-box__divider');
        const declaredHeight = parseInt(box.dataset.height, 10);

        // утилита: посчитать "сжатую" высоту
        const getCollapsedHeight = () => {
            if (divider) {
                const prev = divider.previousElementSibling;
                const prevMb = prev ? parseInt(getComputedStyle(prev).marginBottom, 10) || 0 : 0;
                const h = divider.getBoundingClientRect().top - box.getBoundingClientRect().top - prevMb;
                return Math.max(0, Math.round(h));
            }
            if (!Number.isNaN(declaredHeight) && declaredHeight > 0) return declaredHeight;
            return content.scrollHeight;
        };

        // применяем стартовую высоту
        const applyCollapsed = () => {
            content.style.maxHeight = getCollapsedHeight() + 'px';
        };

        // нужен ли тогглер?
        const needToggle = () => content.scrollHeight > getCollapsedHeight() + 1;

        // скрыть кнопку и ограничения
        const ensureNoButton = () => {
            const btn = box.querySelector('.drop-down-box__link');
            if (btn) btn.remove();
            content.style.maxHeight = 'none';
            box.classList.remove('drop-down-box_expanded');
            box.classList.add('drop-down-box_no-toggle');
        };

        // показать кнопку
        const ensureButton = () => {
            box.classList.remove('drop-down-box_no-toggle');
            let expandButton = box.querySelector('.drop-down-box__link');
            if (!expandButton) {
                expandButton = document.createElement('a');
                expandButton.classList.add('link', 'link_arrow_down', 'drop-down-box__link');
                expandButton.innerHTML = 'Развернуть';
                box.insertAdjacentElement('beforeend', expandButton);

                expandButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    box.classList.toggle('drop-down-box_expanded');

                    if (box.classList.contains('drop-down-box_expanded')) {
                        content.style.maxHeight = content.scrollHeight + 'px';
                        expandButton.innerHTML = 'Свернуть';
                        expandButton.classList.add('link_active');
                    } else {
                        applyCollapsed();
                        expandButton.classList.remove('link_active');
                        expandButton.innerHTML = 'Развернуть';
                    }
                });
            }
            applyCollapsed();
        };

        // инициализация
        if (!needToggle()) {
            ensureNoButton();
        } else {
            ensureButton();
        }

        // ресайз
        window.addEventListener('resize', () => {
            if (!needToggle()) {
                ensureNoButton();
                return;
            }

            ensureButton();
            if (box.classList.contains('drop-down-box_expanded')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                applyCollapsed();
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', expandBlock);
