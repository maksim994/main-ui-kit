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