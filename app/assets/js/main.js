
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
// document.addEventListener('DOMContentLoaded', () => {
//
//     $('.header-mobile-menu-top').slinky();
//     $(".header-mobile-menu-phone").slinky();
//
//     //Бургер открываем
//     $(".header-mobile-burger").on("click", () => {
//         $(".header-burger-icon").toggleClass("active");
//
//         $(".header-mobile-menu").toggleClass("toggle");
//         $(".mobile-nav-overlay").toggleClass("open");
//         $("body").toggleClass("header-open");
//     });
//
//     // закрываем мобильный хедер при клике на оверлей
//     $(".mobile-nav-overlay").on("click", () => {
//         $(".mobile-nav-overlay").toggleClass("open");
//         $(".header-mobile-menu").toggleClass("toggle");
//         $(".header-burger-icon").toggleClass("active");
//         $("body").toggleClass("header-open");
//     });
//
//     // когда нажимаем на телефоны в мобилке, то убираем\возвращаем всё
//     $(".header-mobile-menu-bottom-phone.next").on("click", () => {
//         $(".header-mobile-menu-item").addClass("hidden");
//
//         console.log($(".header-mobile-menu-item"));
//         $(".header-mobile-menu-phone .header").on("click", () => {
//
//             console.log($(".header-mobile-menu-item"));
//
//             $(".header-mobile-menu-item").removeClass("hidden");
//         });
//     });
//
//
//
//     // // показываем, скрываем второй уровень
//     // $(".header-list-more").on("click", function () {
//     //     //взяли родителя и покрасили его
//     //     var parent = $(this).closest(".header-main-link");
//     //
//     //     $(this).closest("li").toggleClass("selected");
//     //     //показали\скрыли второй уровень
//     //     parent.next(".header-list-second").toggle();
//     // });
//
// });
//
//
// const onScrollHeader = () => {
//
//
//     if (window.screen.width > 576) {
//         $(".header-list-second-with-children-wrapper > li").hover(function () {
//             //скрываем все третьи уровни
//             $(".header-list-third").hide();
//             //выбираем нужный для нас и скрываем
//             var listThird = $(this).find(".header-list-third");
//             listThird.css("display", "flex");
//             // меняем высоту
//             //если ширина устройства меньше 576px, то не меняем
//             // if (window.screen.width > 576) {
//             $(".header-list-second-with-children").height(listThird.height());
//             // }
//         });
//
//         $(".header-list-second-has-child-link span").on("click", function () {
//             //скрываем все третьи уровни
//             $(".header-list-third").hide();
//             //выбираем нужный для нас и скрываем
//             var listThird = $(this).find(".header-list-third");
//             listThird.css("display", "flex");
//             // меняем высоту
//             //если ширина устройства меньше 576px, то не меняем
//             // if (window.screen.width > 576) {
//             $(".header-list-second-with-children").height(listThird.height());
//             // }
//         });
//     } else {
//         $(".header-list-second-has-child-link span").on("click", function () {
//             let parent = $(this).closest(".header-list-second-has-child-link");
//             parent.closest("li").toggleClass("selected");
//             parent.next(".header-list-third").toggle();
//         });
//     }
//
//     // проверяем выходим ли мы за правый край
//     function offsetRightCheck(elem, number) {
//         //получаем положение второго уровня
//         // debugger;
//         let offset = elem.offset();
//         // смотрим дистанцию до левого и правого края
//         const distanceToLeft = offset.left;
//         const distanceToRight =
//             $(window).width() - (offset.left + elem.outerWidth());
//         // если правая сторона уходит в минус
//         if (distanceToRight < 0) {
//             switch (number) {
//                 case 2:
//                     elem.addClass("to-left");
//                     break;
//                 case 3:
//                     elem.parent().parent().addClass("to-left");
//                     break;
//             }
//         }
//     }
//
//     // header2 (desktop)
//     $(".header2-link").hover(function () {
//         // если второй И третий уровни есть
//         if ($(this).find(".header2-list-second").length > 0) {
//             const elem = $(this).find(".header2-list-second");
//             offsetRightCheck(elem, 2);
//             const elem2 = $(this)
//                 .find(".header2-list-second")
//                 .find(".header2-list-third");
//             offsetRightCheck(elem2, 3);
//         }
//     });
//
//     // //Бургер открываем
//     // $(".header-mobile__burger").on("click", () => {
//     //     //меняем иконку бургера
//     //     $(".header-burger-icon").toggleClass("active");
//     //
//     //     $(".header-mobile-menu").toggleClass("toggle");
//     //     $(".mobile-nav-overlay").toggleClass("open");
//     //     $("body").toggleClass("header-open");
//     // });
//     //
//     // // закрываем мобильный хедер при клике на оверлей
//     // $(".mobile-nav-overlay").on("click", () => {
//     //     $(".mobile-nav-overlay").toggleClass("open");
//     //     $(".header-mobile-menu").toggleClass("toggle");
//     //     $(".header-burger-icon").toggleClass("active");
//     //     $("body").toggleClass("header-open");
//     // });
//
//     // показываем, скрываем второй уровень
//     $(".header-list-more").on("click", function () {
//         //взяли родителя и покрасили его
//         var parent = $(this).closest(".header-main-link");
//         $(this).closest("li").toggleClass("selected");
//         //показали\скрыли второй уровень
//         parent.next(".header-list-second").toggle();
//     });
//
//     // телефон
//     // смена телефона
//
//     // телефон выпадашка. если экран маленький, то она выходит за пределы. это плохо
//
//     // header 2
//     const btnMegamenu = document.querySelector(".header2-catalog_megabtn");
//     const header2Dropdown = document.querySelector(".header2-dropdown");
//
//     if (btnMegamenu && header2Dropdown) {
//         btnMegamenu.addEventListener("click", (e) => {
//             header2Dropdown.classList.toggle("open");
//             btnMegamenu.classList.toggle("open");
//         });
//
//         // скрывам при клике на другие объекты
//         document.addEventListener("click", function (event) {
//             let isClickInside1 = btnMegamenu.contains(event.target);
//             let isClickInside2 = header2Dropdown.contains(event.target);
//
//             if (!isClickInside1 && !isClickInside2) {
//                 header2Dropdown.classList.remove("open");
//                 btnMegamenu.classList.remove("open");
//             }
//         });
//     }
//
//     function toggleSubcategory(li, shouldOpen) {
//         // const displayStyle = shouldOpen ? "block" : "none";
//         for (let i = 4; i < li.length - 1; i++) {
//             // li[i].style.display = displayStyle;
//             if (!shouldOpen) {
//                 slideUp(li[i]);
//             } else {
//                 slideDown(li[i]);
//             }
//         }
//     }
//
//     // функция для того, чтобы скрыть
//     function slideUp(block, duration = 300) {
//         block.style.overflow = "hidden";
//         // Устанавливаем текущую высоту
//         block.style.height = `${block.scrollHeight}px`;
//         // Ждем, пока высота установится, затем уменьшаем до 0
//         block.style.transition = `height ${duration}ms ease`;
//
//         setTimeout(() => {
//             block.style.height = "0";
//         }, 0);
//
//         // После завершения анимации, скрываем элемент и убираем свойства
//         setTimeout(() => {
//             block.style.display = "none";
//             block.style.height = "";
//             block.style.transition = "";
//             block.style.overflow = "";
//         }, duration);
//     }
//
//     // функция для того, чтобы показать
//     function slideDown(block, duration = 300) {
//         // Сначала показываем элемент
//         block.style.display = "block";
//         // Получаем полную высоту
//         const height = `${block.scrollHeight}px`;
//         // Устанавливаем высоту в 0
//         block.style.height = "0";
//         block.style.transition = `height ${duration}ms ease`;
//         block.style.overflow = "hidden";
//
//         // Ждем, пока высота установится, затем увеличиваем до полной высоты
//         setTimeout(() => {
//             block.style.height = height;
//         }, 0);
//
//         // После завершения анимации, убираем свойства
//         setTimeout(() => {
//             block.style.height = "";
//             block.style.transition = "";
//             block.style.overflow = "";
//         }, duration);
//     }
//
//     const allSubcategories = document.querySelectorAll(
//         ".header2-dropdown_left-subcategory"
//     );
//
//     if (allSubcategories) {
//         allSubcategories.forEach((subcategory) => {
//             const li = subcategory.querySelectorAll("li");
//             const btn = subcategory.querySelector("button");
//
//             if (li.length > 4) {
//                 toggleSubcategory(li, false);
//             } else {
//                 li[li.length - 1].style.display = "none";
//             }
//
//             if (btn) {
//                 btn.addEventListener("click", () => {
//                     const isOpen = btn.classList.toggle("open");
//                     toggleSubcategory(li, isOpen);
//                     btn.textContent = isOpen ? "Скрыть" : "Ещё";
//                 });
//             }
//         });
//     }
//
//     // поиск
//     const searchType = document.querySelector(".header2-search-dropdown-type");
//     const searchAllTypes = document.querySelectorAll(
//         ".header2-search-dropdown-types_item span"
//     );
//     const seachContTypes = document.querySelector(
//         ".header2-search-dropdown-types"
//     );
//     const types = {
//         catalog: "Каталог",
//         all: "Везде",
//     };
//
//     // при клике на выбранные открываем список
//     searchType.addEventListener("click", () => {
//         seachContTypes.classList.toggle("open");
//         searchType.classList.toggle("open");
//     });
//
//     searchAllTypes.forEach((type) => {
//         type.addEventListener("click", () => {
//             const typeName = type.dataset.type;
//             document.querySelector("#searchType").value = typeName;
//             seachContTypes.classList.toggle("open");
//             searchType.textContent = types[typeName];
//         });
//     });
//
//     // скрыть вне элементов
//     document.addEventListener("click", function (event) {
//         let isClickInside1 = searchType.contains(event.target);
//         let isClickInside2 = seachContTypes.contains(event.target);
//
//         if (!isClickInside1 && !isClickInside2) {
//             seachContTypes.classList.remove("open");
//             searchType.classList.remove("open");
//         }
//     });
//
//     // $(".header2-mobile-catalogmenu").slinky();
// };


document.addEventListener('DOMContentLoaded', () => {
    const headers = document.querySelectorAll('.js-header-mobile');



    headers.forEach((header) => {
        const burger = header.querySelector('.header-mobile__burger');
        const overlay = header.querySelector('.header-mobile__overlay');
        const panel = header.querySelector('.header-mobile__panel');
        const submenuToggles = header.querySelectorAll('.mobile-nav__link--toggle');
        const backButtons = header.querySelectorAll('.mobile-nav__back');

        if (!burger || !overlay || !panel) return;

        const openHeader = () => {
            header.classList.add('is-open');
            burger.setAttribute('aria-expanded', 'true');
            document.documentElement.classList.add('is-lock');
            document.body.classList.add('is-lock');
        };

        const closeAllSubmenus = () => {
            header.querySelectorAll('.mobile-nav__item.is-open').forEach((item) => {
                item.classList.remove('is-open');
            });
        };

        const closeHeader = () => {
            header.classList.remove('is-open');
            burger.setAttribute('aria-expanded', 'false');
            closeAllSubmenus();
            document.documentElement.classList.remove('is-lock');
            document.body.classList.remove('is-lock');
        };

        burger.addEventListener('click', () => {
            const isOpen = header.classList.contains('is-open');
            if (isOpen) {
                closeHeader();
            } else {
                openHeader();
            }
        });

        overlay.addEventListener('click', closeHeader);

        submenuToggles.forEach((toggle) => {
            toggle.addEventListener('click', () => {
                const item = toggle.closest('.mobile-nav__item--has-children');
                if (!item) return;

                item.classList.add('is-open');
            });
        });

        backButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const submenu = button.closest('.mobile-nav__submenu');
                const item = submenu?.closest('.mobile-nav__item--has-children');
                if (!item) return;

                item.classList.remove('is-open');
            });
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && header.classList.contains('is-open')) {
                closeHeader();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 991 && header.classList.contains('is-open')) {
                closeHeader();
            }
        });
    });
});
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
document.addEventListener('DOMContentLoaded', () => {
    // $('#menu').slinky();

    if (document.getElementById('map')) {

        initMap();

        async function initMap() {
            // Промис `ymaps3.ready` будет зарезолвлен, когда загрузятся все компоненты основного модуля API
            await ymaps3.ready;

            const {YMap, YMapDefaultSchemeLayer} = ymaps3;

            // Иницилиазируем карту
            const map = new YMap(
                // Передаём ссылку на HTMLElement контейнера
                document.getElementById('map'),
                {
                    location: {
                        // Координаты центра карты
                        center: [37.588144, 55.733842],

                        // Уровень масштабирования
                        zoom: 10
                    }
                }
            );

            // Добавляем слой для отображения схематической карты
            map.addChild(new YMapDefaultSchemeLayer());
        }
    }

});
//# sourceMappingURL=main.js.map