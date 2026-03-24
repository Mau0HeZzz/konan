# Konan Frontend

Документация по текущему состоянию проекта. Это описание именно этого репозитория с учетом локальных правок и кастомных модулей.

## Что это за проект

Это мультистраничный фронтенд на `Vite + SCSS + обычный HTML`.

Главная идея:
- страницы лежат в `index.html` и `pages/*.html`;
- общие куски страницы лежат в `src/html/*.html`;
- итоговая сборка попадает в `dist/`;
- редактировать нужно исходники, а не `dist`.

HTML собирается через тег вида:

```html
<load src="src/html/_header.html" />
```

То есть:
- если меняется только одна страница, правим `index.html` или `pages/*.html`;
- если меняется общий блок, правим файл в `src/html/`.

## Стек и структура

Основное:
- `Vite 5`
- `Sass/SCSS`
- HTML includes через `<load ... />`
- статические ассеты из `public/`
- JS-точка входа: `src/js/app.js`
- SCSS-точка входа: `src/scss/style.scss`

Ключевые папки:
- `pages/` - дополнительные HTML-страницы проекта
- `src/html/` - общие partial-файлы: head, header, footer, popups
- `src/js/files/` - проектный JS
- `src/js/libs/` - библиотеки и шаблонные модули
- `src/scss/` - стили
- `public/` - картинки, иконки, видео, шрифты, которые копируются в сборку как есть
- `dist/` - результат `npm run build`

Страницы, которые сейчас собираются:
- `index.html`
- `pages/home.html`
- `pages/404.html`

## Запуск проекта

### Что должно быть установлено

Минимум:
- `Node.js >= 18` - это требование самого `vite@5`
- `npm`

Рекомендуемый вариант:
- `Node.js 20+`

Локально сборка была проверена на:
- `node v25.6.0`
- `npm 11.8.0`

### Установка зависимостей

```bash
npm install
```

### Режим разработки

```bash
npm run dev
```

Что делает:
- поднимает Vite dev server
- по текущему конфигу сервер доступен на `http://localhost:3000`

### Production build

```bash
npm run build
```

Что делает:
- собирает HTML/JS/CSS в `dist/`
- оптимизирует изображения через `vite-plugin-image-optimizer`
- пишет основные бандлы в `dist/assets/`

После сборки в проекте появляются, как минимум:
- `dist/index.html`
- `dist/pages/home.html`
- `dist/pages/404.html`
- `dist/assets/app.js`
- `dist/assets/style.css`

### Просмотр production-сборки

```bash
npm run preview
```

## Как здесь работать с HTML

Если вы работаете только с HTML, держите в голове 4 правила:

1. Не редактируйте `dist/` вручную. Это артефакт сборки.
2. Общие части страницы живут в `src/html/`.
3. Основное подключение JS идет из `src/html/_js.html`, там подключается `src/js/app.js`.
4. Почти вся интерактивность в проекте завязана на `data-*` атрибуты в HTML.

## Что подключено сейчас

Сейчас в `src/js/app.js` реально включены:
- бургер-меню
- popup-модуль
- валидация и отправка форм
- quantity-счетчики
- кастомные select
- inputmask
- range-слайдеры (`noUiSlider`)
- tooltips (`tippy.js`)
- слайдеры (`Splide`)
- lazyload
- scroll watcher
- плавная навигация по `data-goto`
- логика хедера при скролле
- lightGallery
- DynamicAdapt
- кастомный `script.js` с картами, responsive utility-классами и логикой корзины

Если какой-то модуль есть в кодовой базе, но "не работает", сначала проверьте, импортирован ли он в `src/js/app.js`.

## Формы

### Базовые правила разметки

Для обычного поля лучше использовать такую структуру:

```html
<label class="form__item">
  <input type="text" name="name" placeholder="Введите имя" data-required data-error="Введите имя">
</label>
```

Почему именно так:
- ошибка (`.form__error`) вставляется внутрь родителя поля;
- классы состояний (`_form-focus`, `_form-input`, `_form-error`) вешаются и на поле, и на его родителя.

Поведение по умолчанию:
- placeholder скрывается на фокусе;
- если нужно оставить placeholder, добавьте `data-placeholder-nohide`;
- если не нужны служебные классы фокуса, добавьте `data-no-focus-classes`;
- если на поле стоит `data-validate`, валидация выполняется сразу при потере фокуса;
- без `data-validate` проверка произойдет на submit формы.

### Валидация: какие атрибуты понимает проект

Основные варианты:

| Атрибут                               | Что делает                                                     |
| ---                                   | ---                                                            |
| `data-required`                       | обычное обязательное поле                                      |
| `data-required="email"`               | проверка email                                                 |
| `data-required="phone"`               | проверка телефона                                              |
| `data-required="fio"`                 | ожидает минимум имя и фамилию                                  |
| `data-required="date"`                | проверка даты в формате `dd/mm/yy` или `dd/mm/yyyy`            |
| `data-required="password"`            | проверка пароля и совпадения всех password-полей в одной форме |
| `data-required="checkbox-list-group"` | требует хотя бы один отмеченный checkbox в группе              |
| `data-error="Текст ошибки"`           | текст ошибки под полем                                         |
| `data-validate`                       | мгновенная проверка при `blur`                                 |
| `data-no-validate` на `form`          | полностью выключает валидацию формы                            |

Дополнительно по типам полей:

- `checkbox` с `data-required` должен быть отмечен
- `radio` считается валидным, если выбран любой `radio` с тем же `name`
- `file` проверяется по наличию файла, размеру и `accept`

Для `password` есть дополнительная логика:
- если в форме несколько полей с `data-required="password"`, они должны совпадать;
- можно добавить `data-pattern`, чтобы проверить пароль регулярным выражением;
- текст ошибки можно задать через `data-error`.

Пример:

```html
<form class="form">
  <label class="form__item">
    <input
      type="password"
      name="password"
      placeholder="Пароль"
      data-required="password"
      data-pattern="^(?=.*[A-Z])(?=.*\\d).{8,}$"
      data-error="Минимум 8 символов, одна цифра и одна заглавная буква"
    >
  </label>

  <label class="form__item">
    <input
      type="password"
      name="password_confirm"
      placeholder="Повторите пароль"
      data-required="password"
      data-error="Пароли не совпадают"
    >
  </label>
</form>
```

### Группы checkbox

Если нужно, чтобы из группы был выбран хотя бы один checkbox, всем checkbox группы задается один и тот же `data-required` с префиксом `checkbox-list-`.

Пример:

```html
<label class="form__boxwrap">
  <input type="checkbox" name="delivery[]" value="courier" data-required="checkbox-list-delivery">
  <i></i>
  <span>Курьер</span>
</label>

<label class="form__boxwrap">
  <input type="checkbox" name="delivery[]" value="pickup" data-required="checkbox-list-delivery">
  <i></i>
  <span>Самовывоз</span>
</label>
```

### Файлы

У `input[type="file"]` работает:
- `data-required` - файл обязателен
- `accept` - допустимые типы/расширения
- `data-maxsize="5"` - максимум 5 МБ
- `data-minsize="1"` - минимум 1 МБ

Пример:

```html
<label class="form__item">
  <input
    type="file"
    name="resume"
    data-required
    accept=".pdf,.doc,.docx"
    data-maxsize="5"
    data-error="Нужен файл PDF/DOC до 5 МБ"
  >
</label>
```

Есть кастомная связка `data-validate-when-file-valid`.

Смысл:
- если на форме есть валидный файл, можно пропускать валидацию другого поля;
- в атрибут нужно передать селектор file input внутри той же формы.

Пример:

```html
<label class="form__item">
  <input type="file" class="js-passport-file" data-required accept=".pdf,.jpg,.png">
</label>

<label class="form__item">
  <input
    type="text"
    name="passport_number"
    placeholder="Номер паспорта"
    data-required
    data-validate-when-file-valid=".js-passport-file"
  >
</label>
```

В таком сценарии поле `passport_number` не будет ругаться, если файл уже приложен и сам file input валиден.

### Отправка формы

По умолчанию:
- если на `form` нет специальных атрибутов, браузер отправит форму обычным способом;
- если валидация не пройдена, submit будет отменен.

Дополнительные режимы:

| Атрибут на `form`               | Что делает                                                            |
| ---                             | ---                                                                   |
| `data-ajax`                     | отправка через `fetch` на `action`/`method`                           |
| `data-dev`                      | dev-режим: имитация отправки, случайный success/error через 2 секунды |
| `data-popup-success="#popupId"` | открыть popup после успешной отправки                                 |
| `data-popup-error="#popupId"`   | открыть popup после ошибочной отправки                                |
| `data-timeout="3000"`           | через сколько миллисекунд закрыть success/error popup                 |
| `data-goto-error`               | прокрутить к первой ошибке                                            |
| `data-goto-error=".selector"`   | использовать свой селектор вместо `._form-error`                      |

Пример AJAX-формы:

```html
<form
  class="form"
  action="/ajax/feedback"
  method="POST"
  data-ajax
  data-popup-success="#successPopup"
  data-popup-error="#errorPopup"
  data-timeout="2500"
  data-goto-error
>
  <label class="form__item">
    <input type="text" name="name" placeholder="Имя" data-required data-error="Введите имя">
  </label>

  <label class="form__item">
    <input type="text" name="email" placeholder="Email" data-required="email">
  </label>

  <button type="submit" class="btn btn-blue">Отправить</button>
</form>
```

### Inputmask

`src/js/files/forms/inputmask.js` прогоняет `Inputmask()` по всем `input` на странице. Маска реально применяется там, где поле описано через `data-inputmask`.

Самый частый пример:

```html
<input
  type="text"
  name="phone"
  placeholder="+7 (000) 000-00-00"
  data-required="phone"
  data-inputmask="'mask':'+7 (999) 999-99-99'"
>
```

Пример для даты:

```html
<input
  type="text"
  name="birthday"
  placeholder="31/12/2026"
  data-required="date"
  data-inputmask="'mask':'99/99/9999'"
>
```

Важно:
- синтаксис атрибута берется из `Inputmask`;
- маска и валидация даты работают лучше вместе;
- для email маска обычно не нужна.

### Кастомные select

Кастомные select находятся в `src/js/libs/select.js`.

Чтобы select вообще подхватился, на нативный `<select>` нужно поставить:

```html
data-custom-select
```

Простой пример:

```html
<label class="form__item">
  <select
    name="city"
    data-custom-select
    data-required
    data-validate
    data-search
    data-class-modif="city"
  >
    <option value="" data-label="Город">Выберите город</option>
    <option value="spb">Санкт-Петербург</option>
    <option value="msk">Москва</option>
    <option value="kzn">Казань</option>
  </select>
</label>
```

Как это работает:
- исходный `<select>` остается в DOM, но скрывается;
- рядом строится обертка `.select`;
- submit и валидация используют именно оригинальный `<select>`, а не декоративную обертку.

Атрибуты самого `<select>`:

| Атрибут                     | Что делает                                  |
| ---                         | ---                                         |
| `data-custom-select`        | включает кастомный select                   |
| `multiple`                  | мультивыбор                                 |
| `data-class-modif="name"`   | добавляет обертке класс `select_name`       |
| `data-search`               | поиск по списку                             |
| `data-open`                 | открывает select сразу после инициализации  |
| `data-submit`               | автоматически submit формы после выбора     |
| `data-scroll="200"`         | ограничивает высоту выпадающего списка      |
| `data-checkbox`             | стиль чекбоксов для `multiple`              |
| `data-show-selected`        | не скрывает выбранный option в списке       |
| `data-pseudo-label="Текст"` | псевдо-лейбл в заголовке select             |
| `data-tags`                 | показывает выбранные значения тегами        |
| `data-tags=".selector"`     | рендерит теги в указанный внешний контейнер |

Атрибуты на родителе:

| Атрибут           | Что делает                                                  |
| ---               | ---                                                         |
| `data-one-select` | внутри контейнера можно держать открытым только один select |

Атрибуты placeholder-option (обычно `option value=""`):

| Атрибут            | Что делает                                  |
| ---                | ---                                         |
| `data-label="..."` | текст label над значением                   |
| `data-show`        | не скрывать placeholder в выпадающем списке |

Атрибуты на `option`:

| Атрибут            | Что делает                         |
| ---                | ---                                |
| `data-class="..."` | класс для option                   |
| `data-asset="..."` | вторая колонка: картинка или текст |
| `data-href="..."`  | option рендерится как ссылка       |
| `data-href-blank`  | открыть ссылку в новом окне        |

Пример мультиселекта с тегами:

```html
<div class="js-tags"></div>

<select
  name="products[]"
  multiple
  data-custom-select
  data-checkbox
  data-tags=".js-tags"
>
  <option value="lock">Замки</option>
  <option value="camera">Камеры</option>
  <option value="accessories">Аксессуары</option>
</select>
```

Нюанс по `data-scroll`:
- высота ограничится;
- но красивый JS-scrollbar через `SimpleBar` появится только если включить импорт `src/js/files/scroll/simplebar.js` в `src/js/app.js`.

### Quantity-счетчик

В проекте уже включен модуль `formQuantity()`.

Минимальная разметка:

```html
<div class="quantity" data-quantity>
  <button type="button" class="quantity__button quantity__button_minus"></button>
  <div class="quantity__input">
    <input type="text" value="1" min="1" max="10" data-step="1">
  </div>
  <button type="button" class="quantity__button quantity__button_plus"></button>
</div>
```

Что умеет:
- `min`
- `max`
- `data-step`
- событие `changeQuantity`
- событие `isMinQuantityDestination`, когда счетчик упирается в минимальное значение

### Range-слайдер (`noUiSlider`)

Модуль включен в `src/js/app.js`.

Разметка:

```html
<div data-range-parent>
  <input type="text" data-min-input value="1000">
  <input type="text" data-max-input value="5000">
  <div data-range data-min="0" data-max="10000" data-values="1000,5000"></div>
</div>
```

Как это работает:
- `data-range` - сам слайдер;
- `data-range-parent` - общий контейнер;
- `[data-min-input]` и `[data-max-input]` синхронизируются со слайдером;
- `data-values="1000,5000"` задает стартовые значения.

## Прочие полезные фишки и как ими пользоваться из HTML

### DynamicAdapt

Файл: `src/js/libs/dynamic_adapt.js`

Это перенос DOM-элемента в другое место на нужном брейкпоинте.

Синтаксис:

```html
data-da="селектор, breakpoint, place"
```

Пример из проекта:

```html
<a
  href="#"
  class="btn header__callback"
  data-popup="#callbackPopup"
  data-da=".menu__body, 991, last"
>
  Заказать консультацию
</a>
```

Что это значит:
- пока ширина окна `<= 991px`, элемент переносится в `.menu__body`;
- когда ширина снова станет больше, элемент вернется на исходное место;
- `place` может быть `first`, `last` или индексом.

Важно:
- в проекте используется `new DynamicAdapt("max")`;
- значит перенос срабатывает именно на `max-width`, то есть "до брейкпоинта включительно".

Кастомное расширение проекта:
- поддерживается `data-da-parent`;
- если элемент находится внутри блока с `data-da-parent`, селектор назначения ищется внутри этого блока;
- если в `data-da` указать `parent`, элемент переносится прямо в ближайший `data-da-parent`.

### Popup

Файл: `src/js/libs/popup.js`

Открытие popup:

```html
<a href="#" data-popup="#callbackPopup">Открыть popup</a>
```

Закрытие popup:

```html
<button type="button" data-close>Закрыть</button>
```

Базовая структура:

```html
<div id="callbackPopup" aria-hidden="true" class="popup">
  <div class="popup__wrapper">
    <div class="popup__content">
      <button type="button" data-close>Закрыть</button>
      ...
    </div>
  </div>
</div>
```

Что умеет popup-модуль:
- открытие по `data-popup`
- закрытие по `data-close`
- закрытие по клику вне `.popup__content`
- закрытие по `Esc`
- блокировка прокрутки body
- работа с hash в URL
- автоматическое восстановление фокуса

Отдельная мобильная фишка проекта:

```html
<div class="popup__dragclose" data-dragclose></div>
```

или:

```html
<div class="popup__dragclose" data-dragclose="30"></div>
```

Смысл:
- popup можно закрыть свайпом вниз;
- число в `data-dragclose` - процент высоты окна, после которого popup закроется;
- если атрибут без числа, используется значение по умолчанию `25`.

### Яндекс Карты: `initYaMaps()`

Файл: `src/js/files/script.js`

Карта подхватывается автоматически, если на странице есть:
- `[data-map]`
- или `[data-yandex-map]`

Пример:

```html
<div
  class="contact-form__map"
  data-map
  data-center="30.338416, 59.832014"
  data-marker="30.338416, 59.832014"
  data-zoom="14"
></div>
```

Атрибуты:

| Атрибут                        | Что делает                  |
| ---                            | ---                         |
| `data-map` / `data-yandex-map` | включает автозагрузку карты |
| `data-center="lng, lat"`       | центр карты                 |
| `data-marker="lng, lat"`       | координаты маркера          |
| `data-zoom="14"`               | зум                         |

Важно:
- скрипт Яндекс Карт грузится только если карта реально есть в HTML;
- API key берется из `window.mhzGlobalSettings.yandexApiKey`;
- путь до иконки маркера берется из `window.mhzGlobalSettings.templatePath`.

Сейчас это задается в `src/html/_footer.html`:

```html
<script>
  window.mhzGlobalSettings = {
    templatePath: '/',
    yandexApiKey: '...'
  }
</script>
```

При натяжке на бек:
- замените `templatePath` на реальный путь к шаблону;
- замените `yandexApiKey` на свой ключ.

### `applyResponsiveDnStyles()` и responsive utility-классы

Файл: `src/js/files/script.js`

В проекте есть 2 уровня responsive-хелперов.

#### 1. Готовые SCSS-классы, которые уже используются в верстке

Они описаны в `src/scss/common.scss`:

| Класс     | Что делает                      |
| ---       | ---                             |
| `_md1dn`  | скрыть элемент на `<= $pc`      |
| `_mmd1dn` | скрыть элемент на `>= $pc`      |
| `_md2dn`  | скрыть элемент на `<= 991.98px` |
| `_mmd2dn` | скрыть элемент на `>= 991.98px` |
| `_md3dn`  | скрыть элемент на `<= 767.98px` |
| `_mmd3dn` | скрыть элемент на `>= 767.98px` |
| `_md4dn`  | скрыть элемент на `<= 479.98px` |
| `_mmd4dn` | скрыть элемент на `>= 479.98px` |

Именно этот вариант сейчас реально используется в HTML проекта.

#### 2. Runtime-генератор из `applyResponsiveDnStyles()`

Функция на `DOMContentLoaded` сканирует DOM и инжектит CSS для utility-классов.

Она умеет такой синтаксис:

| Класс          | Что делает                                                |
| ---            | ---                                                       |
| `_md-768-dn`   | `display:none`, если ширина окна меньше `768px`           |
| `_mmd-768-dn`  | `display:none`, если ширина окна больше или равна `768px` |
| `_cmd-500-dn`  | `display:none` по container query                         |
| `_cmmd-500-dn` | `display:none` по container query в обратную сторону      |
| `gap-2`        | `gap: calc(var(--base-indent) * 2)`                       |
| `c-gap-2`      | `column-gap: calc(var(--base-indent) * 2)`                |
| `r-gap-2`      | `row-gap: calc(var(--base-indent) * 2)`                   |
| `max-w-10`     | `max-width: calc(var(--base-indent) * 10)`                |
| `min-w-10`     | `min-width: calc(var(--base-indent) * 10)`                |
| `max-h-10`     | `max-height: calc(var(--base-indent) * 10)`               |
| `min-h-10`     | `min-height: calc(var(--base-indent) * 10)`               |

Пример:

```html
<div class="_md-768-dn gap-2 max-w-20">...</div>
```

Нюанс:
- генератор срабатывает один раз на `DOMContentLoaded`;
- если HTML добавляется на страницу позже через AJAX, эти классы сами не пересчитаются.

### Плавная навигация по странице

Файл: `src/js/files/scroll/scroll.js`

Пример:

```html
<a href="#" data-goto="#contacts" data-goto-header data-goto-top="20">Контакты</a>
```

Атрибуты:

| Атрибут              | Что делает                            |
| ---                  | ---                                   |
| `data-goto="#id"`    | прокрутка к блоку                     |
| `data-goto=".class"` | прокрутка к блоку по классу           |
| `data-goto-header`   | учесть высоту `header`                |
| `data-goto-top="20"` | добавить дополнительный отступ сверху |

### Scroll watcher

Файл: `src/js/libs/watcher.js`

Если на элемент поставить `data-watch`, модуль начинает следить за его появлением в viewport.

Пример:

```html
<section id="contacts" data-watch data-watch-once></section>
```

Что будет:
- при появлении элемента добавится класс `_watcher-view`;
- если есть `data-watch-once`, наблюдение отключится после первого пересечения.

Поддерживаемые атрибуты:

| Атрибут                       | Что делает                                                      |
| ---                           | ---                                                             |
| `data-watch`                  | включает наблюдение                                             |
| `data-watch-root=".selector"` | Селектор контейнера внутри которого нужно следить за объектом   |
| `data-watch-threshold="0.5"`  | Сколько процентов обхекта нужно прокрутить чтоб watcher сработал|
| `data-watch-once`             | наблюдать только один раз                                       |

Спецрежим для навигации:
- если у секции стоит `data-watch="navigator"`, то ссылка с соответствующим `data-goto` получает класс `_navigator-active`.

### Gallery

Файл: `src/js/files/gallery.js`

Чтобы включить `lightGallery`, достаточно обернуть галерею в контейнер с `data-gallery`.

Пример:

```html
<div data-gallery>
  <a href="/img/full-1.jpg">
    <img src="/img/thumb-1.jpg" alt="">
  </a>
  <a href="/img/full-2.jpg">
    <img src="/img/thumb-2.jpg" alt="">
  </a>
</div>
```

### Tooltips

Файл: `src/js/files/tippy.js`

Самый простой способ:

```html
<button type="button" data-tippy-content="Подсказка">?</button>
```

### Splide slider

Файл: `src/js/files/sliders.js`

Сейчас в проекте инициализация очень простая:
- если на странице есть `.splide`, создается один `Splide`
- настройки жестко описаны в `sliders.js`

Минимальная разметка:

```html
<section class="splide" aria-label="Слайдер">
  <div class="splide__track">
    <ul class="splide__list">
      <li class="splide__slide">Слайд 1</li>
      <li class="splide__slide">Слайд 2</li>
      <li class="splide__slide">Слайд 3</li>
    </ul>
  </div>
</section>
```

Нюанс:
- текущая реализация заточена под один слайдер на странице;
- если понадобится несколько, `sliders.js` придется расширить.

### Spollers

Файл: `src/js/files/functions.js`

Используются через `<details>/<summary>`.

Пример:

```html
<div data-spollers data-one-spoller data-spollers-speed="400">
  <details>
    <summary>Вопрос 1</summary>
    <div>Ответ 1</div>
  </details>
  <details data-open>
    <summary>Вопрос 2</summary>
    <div>Ответ 2</div>
  </details>
</div>
```

Поддерживается:
- `data-one-spoller`
- `data-spollers-speed`
- `data-open`
- `data-spoller-scroll`
- `data-spoller-scroll-noheader`
- `data-spoller-close`

### Tabs

Файл: `src/js/files/functions.js`

Базовая структура:

```html
<div data-tabs data-tabs-animate="300">
  <nav data-tabs-titles>
    <button type="button" class="_tab-active">Описание</button>
    <button type="button">Характеристики</button>
  </nav>
  <div data-tabs-body>
    <div>Контент 1</div>
    <div>Контент 2</div>
  </div>
</div>
```

Дополнительно:
- `data-tabs="991,max"` - на этом брейкпоинте табы могут превращаться в спойлеры
- `data-tabs-animate="300"` - анимация переключения
- `data-tabs-hash` - сохранять активный таб в hash

### Show more

Файл: `src/js/files/functions.js`

Пример:

```html
<div data-showmore="items">
  <div data-showmore-content="3" data-showmore-content-media="991,max,4||767,max,2">
    ...
  </div>
  <button type="button" data-showmore-button>Показать еще</button>
</div>
```

Что умеет:
- режим по высоте (`size`)
- режим по количеству элементов (`items`)
- разное число элементов на разных брейкпоинтах через `data-showmore-content-media`

Нюанс текущей реализации:
- для режима `data-showmore="items"` лучше всегда задавать `data-showmore-content-media`, даже если у вас только одно значение;
- код ожидает этот атрибут при расчете количества элементов.

## Что править чаще всего

Если коротко:

- текст и блоки страницы: `index.html`, `pages/*.html`
- общий header/footer/popups: `src/html/*.html`
- правила форм и поведение: `src/js/files/forms/forms.js`
- кастомные select: `src/js/libs/select.js`
- проектные фишки вроде карт и utility-классов: `src/js/files/script.js`
- подключение/отключение модулей: `src/js/app.js`

## Внешние библиотеки, которые реально используются

- Inputmask: https://github.com/RobinHerbots/Inputmask
- noUiSlider: https://refreshless.com/nouislider/
- Tippy: https://atomiks.github.io/tippyjs/
- Splide: https://splidejs.com/
- lightGallery: https://www.lightgalleryjs.com/docs/
- Yandex Maps JS API v3: https://yandex.ru/maps-api/docs/js-api/

## Итого

Если вы работаете только с HTML, в этом проекте вам обычно достаточно:
- поправить страницу или partial;
- выставить правильные `data-*` атрибуты;
- запустить `npm run dev` для проверки;
- собрать `npm run build`, если нужен production-результат.

Все основные интерактивные сценарии уже завязаны на HTML-атрибуты и не требуют отдельного написания JS под каждый кейс.
