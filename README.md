# Konan Frontend

Актуальная памятка по текущему состоянию проекта. README рассчитан на два сценария:

- работа с исходниками `Vite + SCSS + HTML`;
- интеграция уже собранного `dist` в CMS или шаблонизатор.

## 1. Что это за проект

Это мультистраничный фронтенд на `Vite 5`.

- страницы лежат в `index.html` и `pages/*.html`;
- общие части лежат в `src/html/*.html`;
- JS-точка входа: `src/js/app.js`;
- SCSS-точка входа: `src/scss/style.scss`;
- статические ассеты берутся из `public/`;
- итоговая сборка складывается в `dist/`.

HTML собирается через include-части, например:

```html
<load src="src/html/_header.html" />
```

Рабочее правило простое:

- если меняется отдельная страница, правим `index.html` или `pages/*.html`;
- если меняется общий блок, правим файл в `src/html/`;
- `dist/` руками не редактируем.

## 2. Что лежит в `dist`

После `npm run build` в проекте появляются:

- `dist/pages/...` — все реальные страницы проекта;
- `dist/assets/style.css` — общий CSS;
- `dist/assets/app.js` — общий JS;
- `dist/img/...` — картинки и SVG;
- `dist/files/...` — медиа-файлы;
- `dist/local/template/konan/fonts/...` — шрифты `Onest`;
- `dist/index.html` — служебная страница-навигация по макетам, не production-страница.

Дополнительно важно:

- ссылки на CSS и JS после сборки получают query-параметр вида `?v=TIMESTAMP`;
- итоговая сборка использует абсолютные пути от корня сайта: `/assets/...`, `/img/...`, `/files/...`, `/local/...`;
- проект рассчитан на размещение в корне домена.

Если сайт будет жить в подпапке, одного `window.mhzGlobalSettings.templatePath` недостаточно: он помогает только части runtime-логики в JS, но не переписывает все HTML- и CSS-пути.

Сейчас в `vitejs/pages.config.js` объявлено 18 HTML entry points:

```text
index.html
pages/home.html
pages/404.html
pages/contacts.html
pages/catalog.html
pages/product.html
pages/sales.html
pages/sale.html
pages/reviews.html
pages/payment-delivery.html
pages/guarantees.html
pages/politic.html
pages/partners.html
pages/security.html
pages/basket.html
pages/checkout.html
pages/blog.html
pages/article.html
```

## 3. Что нужно сохранить при интеграции в CMS

Если HTML из `dist/pages/...` разбирается на шаблоны, на странице должны остаться:

```html
<link rel="stylesheet" href="/assets/style.css?v=BUILD_TIMESTAMP">

<script>
  window.mhzGlobalSettings = {
    templatePath: '/',
    yandexApiKey: 'YOUR_YANDEX_MAPS_KEY'
  };
</script>

<script type="module" src="/assets/app.js?v=BUILD_TIMESTAMP"></script>
```

Пояснения:

- `window.mhzGlobalSettings` сейчас приходит из `src/html/_footer.html`;
- `templatePath` используется JS для runtime-путей, например для иконки маркера карты;
- `yandexApiKey` нужен для Яндекс.Карт и при интеграции его лучше заменить на свой;
- query-версия в `style.css` и `app.js` генерируется автоматически при сборке.

При интеграции лучше не переименовывать без необходимости:

- `data-*`-атрибуты;
- BEM-классы;
- структуру HTML у форм, табов, спойлеров, popup-блоков и галерей.

## 4. Активные механики и HTML-хуки

Ниже перечислено то, что действительно включено в текущем `src/js/app.js` и поддерживается в проекте.

### 4.1. Меню, popup и навигация

- `data-toggle-menu` — открывает и закрывает мобильное меню, переключает `html.menu-open`.
- `data-cart-trigger` — открывает и закрывает дропдаун корзины в шапке, переключает `html.cart-dropdown-open`.
- `data-filters-trigger` — открывает и закрывает мобильные фильтры каталога, переключает `html.filters-open`.
- `data-chapters-catalogfull-trigger` — переключает мобильный dropdown разделов каталога.
- `data-popup="#popupId"` — открывает popup из `src/html/_popup.html`.
- `data-goto="#id"` или `data-goto=".class"` — плавная прокрутка к блоку.
- `data-goto-header` — учитывать высоту `header`.
- `data-goto-top="20"` — добавить верхний отступ при прокрутке.

### 4.2. Компоненты, которые завязаны на структуру HTML

- `[data-spollers]` — спойлеры на базе `details/summary`.
- `[data-tabs]` вместе с `[data-tabs-titles]` и `[data-tabs-body]` — табы.
- `[data-showmore]`, `[data-showmore-content]`, `[data-showmore-button]` — блок "показать еще".
- `[data-gallery]` — lightGallery для изображений, iframe и видео.
- `data-da="selector,breakpoint,position"` — Dynamic Adapt.
- `[data-map]` и `[data-yandex-map]` — Яндекс.Карты.

Нюанс по `showmore`:

- если используется `data-showmore="items"`, в текущей реализации лучше всегда задавать `data-showmore-content-media`, потому что код на него рассчитывает.

### 4.3. Формы

Главная логика форм находится в `src/js/files/forms/forms.js`.

Поддерживаемые атрибуты:

| Атрибут | Что делает |
| --- | --- |
| `data-required` | обязательное поле |
| `data-required="email"` | проверка email |
| `data-required="phone"` | проверка телефона |
| `data-required="fio"` | ожидает минимум имя и фамилию |
| `data-required="date"` | проверка даты формата `dd/mm/yy` или `dd/mm/yyyy` |
| `data-required="password"` | проверка пароля и совпадения password-полей в одной форме |
| `data-required="checkbox-list-group"` | требует хотя бы один выбранный checkbox в группе |
| `data-error="Текст ошибки"` | текст ошибки под полем |
| `data-validate` | мгновенная валидация при `blur` |
| `data-no-validate` на `form` | отключить встроенную валидацию формы |
| `data-ajax` на `form` | отправка через `fetch` |
| `data-dev` на `form` | dev-режим с имитацией отправки |
| `data-popup-success="#popupId"` | popup после успешной отправки |
| `data-popup-error="#popupId"` | popup после неуспешной отправки |
| `data-timeout="3000"` | через сколько закрыть popup после отправки |
| `data-goto-error` | прокрутить к первому ошибочному полю |
| `data-validate-when-file-valid=".selector"` | пропускать валидацию поля, если привязанный `file` уже валиден |
| `data-moment-validate` на `form` | сразу включать или выключать submit по текущему состоянию валидации |

Для `input[type="file"]` дополнительно работают:

- `accept`;
- `data-maxsize="5"` — максимум в мегабайтах;
- `data-minsize="1"` — минимум в мегабайтах.

### 4.4. Карты

Карта автоматически подгружается, если на странице есть `[data-map]` или `[data-yandex-map]`.

Поддерживаемые data-атрибуты:

- `data-center="30.338416, 59.832014"` — центр карты;
- `data-marker="30.338416, 59.832014"` — координаты маркера;
- `data-zoom="14"` — масштаб.

JS подставляет иконку маркера по пути:

```text
(window.mhzGlobalSettings.templatePath || '/') + 'img/icons/map_pin.svg'
```

## 5. Кастомные проектные особенности

Кроме типовых шаблонных модулей, в проекте есть своя логика из `src/js/files/script.js`.

Что важно знать:

- на странице статьи боковая навигация генерируется автоматически по заголовкам внутри `.article__content`;
- для `.dropboxes-form` автоматически собирается текст выбранных опций;
- формы с `data-moment-validate` включают и выключают кнопку submit по мере ввода;
- для классов вида `_md3dn`, `_mmd2dn`, `gap-2`, `c-gap-2`, `r-gap-2`, `max-w-12`, `min-w-12`, `max-h-12`, `min-h-12` CSS генерируется на лету при загрузке страницы;
- многие модули инициализируются один раз на `DOMContentLoaded` или `load`.

Практический вывод:

- серверный рендер полной страницы поддерживается нормально;
- поздняя AJAX-вставка новых табов, popup-блоков, карт, галерей и других интерактивных компонентов без доп. JS сейчас не предусмотрена.

## 6. Ключевые файлы и папки

- `vitejs/pages.config.js` — список HTML entry points.
- `vite.config.js` — конфиг сборки.
- `src/html/_head.html`, `_header.html`, `_footer.html`, `_popup.html` — общие partial-файлы.
- `src/js/app.js` — список реально подключенных модулей.
- `src/js/files/script.js` — кастомная логика проекта.
- `src/js/files/forms/forms.js` — валидация и отправка форм.
- `src/scss/style.scss` — главный SCSS-вход.
- `public/` — статические файлы, которые копируются в сборку.
- `scripts/copy-public-svg.js` — пост-шаг, который копирует SVG из `public/img` в `dist/img`.
- `config/appendAssetVersion.js` — дописывает `?v=TIMESTAMP` ко всем CSS- и JS-ссылкам в собранных HTML.

Отдельно важно:

- `vite-plugin-image-optimizer` и конфиг `config/imageOptimizerConfig.js` в репозитории есть, но сам плагин сейчас закомментирован в `vite.config.js`;
- CSS минифицируется через `cssnano`;
- шрифты подключаются через `unplugin-fonts` и в сборке лежат по пути `/local/template/konan/fonts/...`;
- target сборки сейчас `es2017`.

## 7. Пересборка проекта из исходников

Минимум:

- `Node.js >= 18`;
- `npm`.

Рекомендуемый вариант:

- `Node.js 20+`.

Локально проект уже проверялся на:

- `node v25.6.0`;
- `npm 11.8.0`.

Основные команды:

```bash
npm install
npm run dev
npm run build
npm run preview
```

Что делает каждая команда:

- `npm run dev` — поднимает Vite dev server на `http://localhost:3000`;
- `npm run build` — запускает `vite build`, затем `npm run copy:svg`;
- `npm run copy:svg` — копирует только SVG из `public/img` в `dist/img`, сохраняя структуру папок;
- `npm run preview` — локальный просмотр уже собранного `dist`.

## 8. Полезные внешние ссылки

- Vite: <https://vite.dev/guide/>
- Splide: <https://splidejs.com/guides/getting-started/>
- lightGallery: <https://www.lightgalleryjs.com/docs/>
- noUiSlider: <https://refreshless.com/nouislider/>
- Inputmask: <https://github.com/RobinHerbots/Inputmask>
- Tippy.js: <https://atomiks.github.io/tippyjs/>
- Yandex Maps JS API v3: <https://yandex.ru/maps-api/docs/js-api/>

## 9. Быстрая памятка

1. Править нужно исходники, а не `dist`.
2. При интеграции нужно сохранить подключение `style.css`, `app.js` и `window.mhzGlobalSettings`.
3. Если сайт живет не в корне домена, пути придется адаптировать отдельно.
4. Для новых popup, tabs, spollers, gallery и form-блоков безопаснее копировать уже рабочую структуру HTML целиком.
5. Для обязательных полей используйте `data-required` и `data-error`.
6. Для реальной отправки формы убирайте `data-dev`, задавайте `action` и `method`, а при JS-отправке оставляйте `data-ajax`.
7. Для карт замените `yandexApiKey` на боевой ключ.
8. Для `data-showmore="items"` не забывайте про `data-showmore-content-media`.
9. Если интерактивный HTML вставляется в DOM уже после загрузки страницы, потребуется отдельная переинициализация.
