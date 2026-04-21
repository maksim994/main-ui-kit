(function () {
    try {
        const stored = localStorage.getItem('theme');
        const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = stored || (systemDark ? 'dark' : 'light');

        document.documentElement.setAttribute('data-theme', theme);

        const meta = document.getElementById('theme-color-meta');
        if (meta) {
            meta.setAttribute('content', theme === 'dark' ? '#0f1115' : '#ffffff');
        }
    } catch (_) {}
})();

(function () {
    const root = document.documentElement;
    const meta = document.getElementById('theme-color-meta');

    const safeGet = (key) => {
        try {
            return localStorage.getItem(key);
        } catch (_) {
            return null;
        }
    };

    const safeSet = (key, value) => {
        try {
            localStorage.setItem(key, value);
        } catch (_) {}
    };

    function syncUI(theme) {
        document.querySelectorAll('.theme-switcher').forEach((switcher) => {
            const lightBtn = switcher.querySelector('.theme-switcher__btn--light');
            const darkBtn = switcher.querySelector('.theme-switcher__btn--dark');

            if (lightBtn) {
                lightBtn.classList.toggle('is-active', theme === 'light');
                lightBtn.setAttribute('aria-pressed', String(theme === 'light'));
            }

            if (darkBtn) {
                darkBtn.classList.toggle('is-active', theme === 'dark');
                darkBtn.setAttribute('aria-pressed', String(theme === 'dark'));
            }
        });
    }

    function setTheme(next, { persist = true } = {}) {
        if (next !== 'light' && next !== 'dark') return;

        root.setAttribute('data-theme', next);

        if (meta) {
            meta.setAttribute('content', next === 'dark' ? '#0f1115' : '#ffffff');
        }

        if (persist) {
            safeSet('theme', next);
        }

        syncUI(next);
    }

    function bindSwitchers() {
        document.querySelectorAll('.theme-switcher').forEach((switcher) => {
            if (switcher.dataset.bound === '1') return;
            switcher.dataset.bound = '1';

            const lightBtn = switcher.querySelector('.theme-switcher__btn--light');
            const darkBtn = switcher.querySelector('.theme-switcher__btn--dark');

            if (lightBtn) {
                lightBtn.addEventListener('click', () => setTheme('light'));
            }

            if (darkBtn) {
                darkBtn.addEventListener('click', () => setTheme('dark'));
            }
        });
    }

    const stored = safeGet('theme');
    const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = stored || (systemDark ? 'dark' : 'light');

    function init() {
        bindSwitchers();
        setTheme(initialTheme, { persist: false });

        const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
        if (mq && mq.addEventListener) {
            mq.addEventListener('change', (e) => {
                if (!safeGet('theme')) {
                    setTheme(e.matches ? 'dark' : 'light', { persist: false });
                }
            });
        }

        if (document.body) {
            new MutationObserver(() => {
                bindSwitchers();
                syncUI(root.getAttribute('data-theme'));
            }).observe(document.body, { childList: true, subtree: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();