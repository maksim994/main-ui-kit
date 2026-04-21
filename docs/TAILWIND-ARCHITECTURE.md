# Архитектура в стиле Tailwind

## Принципы

1. **Utility-first** — один класс = одно свойство
2. **Composition in HTML** — собираем стили в разметке, не в CSS
3. **Design tokens** — все значения из переменных (`:root`)
4. **Модификаторы через дополнительные классы** — `btn btn-primary btn-sm`, а не вложенные селекторы

---

## Слои CSS

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 1: Tokens (CSS variables)                            │
│  _vars.scss — цвета, отступы, радиусы, шрифты               │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 2: Base utilities (основные классы)                  │
│  Одна ответственность: .flex, .gap-16, .p-4, .text-lg       │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 3: Layout primitives (минимальный layout)             │
│  .wrapper, .row, .grid-list — только структура              │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 4: Components (только необходимое)                    │
│  .btn, .card, .accordion — то, что нельзя выразить утилитами│
│  Компоненты используют токены и утилиты внутри               │
└─────────────────────────────────────────────────────────────┘
```

---

## Основные (core) классы

Это атомарные утилиты — базовый набор, через который модифицируется всё.

### Layout / Display
| Класс | Свойство |
|-------|----------|
| `.flex` | display: flex |
| `.grid` | display: grid |
| `.block` | display: block |
| `.inline` | display: inline |
| `.hidden` | display: none |
| `.flex-col` | flex-direction: column |
| `.flex-row` | flex-direction: row |
| `.flex-wrap` | flex-wrap: wrap |
| `.flex-nowrap` | flex-wrap: nowrap |
| `.items-center` | align-items: center |
| `.items-start` | align-items: flex-start |
| `.items-end` | align-items: flex-end |
| `.justify-center` | justify-content: center |
| `.justify-between` | justify-content: space-between |
| `.justify-start` | justify-content: flex-start |
| `.justify-end` | justify-content: flex-end |
| `.gap-{n}` | gap из scale (0,4,8,12,16,20,24...) |
| `.w-full` | width: 100% |
| `.min-w-0` | min-width: 0 |
| `.flex-1` | flex: 1 1 0 |
| `.shrink-0` | flex-shrink: 0 |

### Spacing
| Паттерн | Примеры |
|---------|---------|
| margin | `m-0`, `m-4`, `mt-16`, `mx-auto`, `mb-24` |
| padding | `p-0`, `p-4`, `px-16`, `py-8` |
| gap | `gap`, `gap-8`, `gap-16`, `row-gap-4` |

### Typography
| Класс | Назначение |
|-------|------------|
| `.text-xs` … `.text-xl` | размер шрифта |
| `.font-normal`, `.font-medium`, `.font-bold` | вес |
| `.text-center`, `.text-left`, `.text-right` | выравнивание |
| `.text-theme`, `.text-muted`, `.text-inverse` | цвет текста |
| `.line-clamp-2` | ограничение строк |
| `.h1` … `.h5` | заголовки |

### Colors / Background / Border
| Класс | Назначение |
|-------|------------|
| `.bg-card` | background: var(--card_bg_black) |
| `.bg-surface` | background: var(--black_bg_black) |
| `.bg-theme` | background: var(--theme-base-color) |
| `.text-theme` | color: var(--theme-base-color) |
| `.border` | border: 1px solid var(--stroke_black) |
| `.rounded` | border-radius из токена |
| `.rounded-sm` … `.rounded-full` | радиусы |

### Other
| Класс | Назначение |
|-------|------------|
| `.overflow-hidden` | overflow: hidden |
| `.overflow-auto` | overflow: auto |
| `.transition` | transition: var(--animation) |
| `.truncate` | text-overflow: ellipsis + overflow: hidden |
| `.sr-only` | скрыть визуально, оставить для скринридеров |

---

## Модификаторы (сторонние классы)

Классы, которые **навешиваются поверх** базовых и меняют поведение/внешний вид.

### Размеры
- `btn-sm`, `btn-lg`
- `text-xs`, `text-sm`, `text-lg`, `text-xl`
- `p-4`, `p-8`, `gap-16`

### Варианты
- `btn-primary`, `btn-secondary`, `btn-outline`, `btn-ghost`
- `alert-success`, `alert-danger`
- `card` + `border` (опционально)

### Состояния (если нужны в CSS)
- `.active`, `.open`, `.disabled`
- hover через `.hover\:bg-*` (опционально, добавляется по мере надобности)

### Адаптив
Суффикс брейкпоинта: `-sm`, `-md`, `-lg`, `-xl`
- `flex md:flex-col` — flex по умолчанию, column на md
- `gap-8 md:gap-16` — больше отступ на планшете
- `hidden md:flex` — скрыто на мобиле, flex на desktop

---

## Примеры перехода

### Было (component-first):
```html
<div class="card">
  <div class="card__images">
    <picture class="img img--4-3">...</picture>
  </div>
  <div class="card__inner d-f fd-c gap p-16">
    <a class="card__name">...</a>
  </div>
</div>
```

### Стало (utility-first):
```html
<article class="card flex flex-col overflow-hidden rounded border border-stroke bg-card transition">
  <div class="img img--4-3 overflow-hidden">
    <picture>...</picture>
  </div>
  <div class="flex flex-col flex-1 gap-16 p-16">
    <a class="text-lg font-medium line-clamp-4">...</a>
  </div>
</article>
```

### Карточка как набор утилит (без компонента .card):
```html
<article class="flex flex-col overflow-hidden rounded border border-stroke bg-card p-0 transition hover:border-stroke-hover hover:bg-card-hover">
  ...
</article>
```

### Кнопка (компонент + модификаторы):
```html
<button class="btn btn-primary">Отправить</button>
<button class="btn btn-primary btn-sm">Меньше</button>
<button class="btn btn-outline btn-secondary">Отмена</button>
```

---

## Структура файлов

```
src/scss/
├── _vars.scss              # Токены (существует)
├── base/
│   ├── _reset.scss
│   ├── _variables.scss     # SCSS переменные для генерации
│   ├── _mixins.scss        # Генераторы утилит
│   ├── _grid.scss          # wrapper, row, col-*
│   ├── _typography.scss
│   └── utilities/
│       ├── _core.scss       # flex, display, overflow (НОВЫЙ — ядро)
│       ├── _spacing.scss    # m-*, p-*, gap-*
│       ├── _layout.scss      # w-full, min-w-0, flex-1
│       ├── _colors.scss      # bg-*, text-*, border-* (НОВЫЙ)
│       └── _grid-list.scss
├── components/             # Минимальные компоненты
│   ├── _buttons.scss       # .btn + модификаторы .btn-*
│   ├── _card.scss          # .card — база + опционально
│   └── ...
└── main.scss
```

---

## Соответствие старых и новых классов (миграция)

| Старый (сокращённый) | Новый (Tailwind-like) |
|---------------------|------------------------|
| `d-f` | `flex` |
| `d-b` | `block` |
| `d-n` | `hidden` |
| `fd-c` | `flex-col` |
| `fd-r` | `flex-row` |
| `fw-w` | `flex-wrap` |
| `fw-n` | `flex-nowrap` |
| `ai-c` | `items-center` |
| `ai-fs` | `items-start` |
| `ai-fe` | `items-end` |
| `jc-c` | `justify-center` |
| `jc-sb` | `justify-between` |
| `fb-100` | `basis-full` |

Старые классы продолжают работать (генерируются в `_grid.scss`).

---

## План миграции

1. ~~**Этап 1**: Создать `_core.scss` и `_colors.scss`~~ ✅
2. **Этап 2**: Использовать новые классы в новом коде; старые (`d-f`, `ai-c`) — для обратной совместимости
3. **Этап 3**: Рефакторить компоненты — заменить внутренние стили на утилиты
4. **Этап 4**: Постепенно переписывать HTML — использовать `flex`, `items-center` вместо `d-f`, `ai-c`
5. **Этап 5**: (опционально) Удалить генерацию старых классов из mixin
