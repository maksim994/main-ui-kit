document.addEventListener('DOMContentLoaded', () => {
    const tabsBlocks = document.querySelectorAll('[data-tabs]');

    tabsBlocks.forEach((tabsBlock) => {
        const buttons = tabsBlock.querySelectorAll('.tabs-btn[role="tab"]');
        const panels = tabsBlock.querySelectorAll('.tabs-panel[role="tabpanel"]');

        if (!buttons.length || !panels.length) return;

        const activateTab = (button) => {
            const targetId = button.getAttribute('aria-controls');
            const targetPanel = tabsBlock.querySelector(`#${CSS.escape(targetId)}`);

            if (!targetPanel) return;

            buttons.forEach((btn) => {
                btn.classList.remove('is-active');
                btn.setAttribute('aria-selected', 'false');
                btn.setAttribute('tabindex', '-1');
            });

            panels.forEach((panel) => {
                panel.classList.remove('is-active');
                panel.setAttribute('aria-hidden', 'true');
                panel.setAttribute('data-active', 'false');
            });

            button.classList.add('is-active');
            button.setAttribute('aria-selected', 'true');
            button.setAttribute('tabindex', '0');

            targetPanel.classList.add('is-active');
            targetPanel.setAttribute('aria-hidden', 'false');
            targetPanel.setAttribute('data-active', 'true');
        };

        buttons.forEach((button, index) => {
            if (!button.hasAttribute('tabindex')) {
                button.setAttribute('tabindex', button.classList.contains('is-active') ? '0' : '-1');
            }

            button.addEventListener('click', () => {
                activateTab(button);
            });

            button.addEventListener('keydown', (event) => {
                const currentIndex = Array.from(buttons).indexOf(button);
                let nextIndex = currentIndex;

                if (event.key === 'ArrowRight') {
                    nextIndex = (currentIndex + 1) % buttons.length;
                }

                if (event.key === 'ArrowLeft') {
                    nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
                }

                if (event.key === 'Home') {
                    nextIndex = 0;
                }

                if (event.key === 'End') {
                    nextIndex = buttons.length - 1;
                }

                if (nextIndex !== currentIndex) {
                    event.preventDefault();
                    buttons[nextIndex].focus();
                    activateTab(buttons[nextIndex]);
                }
            });

            if (index === 0 && !tabsBlock.querySelector('.tabs-btn.is-active,[aria-selected="true"]')) {
                activateTab(button);
            }
        });

        const activeButton = tabsBlock.querySelector('.tabs-btn.is-active,[aria-selected="true"]');
        if (activeButton) {
            activateTab(activeButton);
        }
    });
});