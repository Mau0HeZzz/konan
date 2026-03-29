// Подключение функционала "Чертоги Фрилансера"
import { _slideDown, _slideUp, bodyLockToggle, debounce, getDigFromString, isMobile } from "./functions.js";
// Подключение списка активных модулей
import { mhzModules } from "./modules.js";

const mapSelectors = [
  '[data-yandex-map]',
  '[data-map]'
];

const YMAP_SCRIPT_SELECTOR = 'script[data-ymap-loader]';
const YMAP_SCRIPT_GLOBAL_FLAG = '__vegatelYMapScriptInited';
let isYMapScriptInited = false;

document.addEventListener('DOMContentLoaded', () => {
  if (!window[YMAP_SCRIPT_GLOBAL_FLAG] && mapSelectors.some(mapSelector => document.querySelector(mapSelector))) {
    addYmapScript();
  }

  applyResponsiveDnStyles();
})

window.addEventListener('load', () => {
  setMinWidth('.cart-header__price');
})

document.addEventListener('click', (e) => {
  checkCartDropDownState(e);

  const catalogChaptersTrigger = e.target.closest('[data-chapters-catalogfull-trigger]');
  if (catalogChaptersTrigger) {
    e.preventDefault();
    onCatalogChaptersTriggerClick(catalogChaptersTrigger);
  }

  const filtersTrigger = e.target.closest('[data-filters-trigger]');
  if (filtersTrigger) {
    document.documentElement.classList.toggle('filters-open');
    bodyLockToggle();
  }
})

document.addEventListener('input', (e) => {
  if (e.target.closest('.form__item textarea')) {
    autoResizeTextareaDebounced(e.target);
  }

  const momentValidationForm = e.target.closest('form[data-moment-validate]');
  if (momentValidationForm) {
    formMomentValidateHandler(momentValidationForm);
  }
})

document.addEventListener('mouseover', (e) => {
  const miniProduct = e.target.closest('.mini-product');
  if (miniProduct) {
    onMiniProductMouseOver(miniProduct);
  }
})

function applyResponsiveDnStyles() {
  const generators = [
    {
      selector: '[class*="_md"], [class*="_mmd"]',
      classRe: /^_(m?md)-(\d+)-dn$/,
      render: (match, cls) => {
        const [, prefix, size] = match;
        const query =
          prefix === "mmd"
            ? `@media (width >= ${size}px)`
            : `@media (width < ${size}px)`;
        return `${query} { .${cls} { display: none; } }`;
      },
    },
    {
      selector: '[class*="_cmd"], [class*="_cmmd"]',
      classRe: /^_c(m?md)-(\d+)-dn$/,
      render: (match, cls) => {
        const [, prefix, size] = match;
        const query =
          prefix === "mmd"
            ? `@container (width > ${size}px)`
            : `@container (width <= ${size}px)`;
        return `${query} { .${cls} { display: none; } }`;
      },
    },
    {
      selector: '[class*="gap-"]',
      classRe: /^gap-(\d+)$/,
      render: (match, cls) => {
        const [, value] = match;
        return `.${cls} { gap: calc(var(--base-indent) * ${value}); }`;
      },
    },
    {
      selector: '[class*="c-gap-"]',
      classRe: /^c-gap-(\d+)$/,
      render: (match, cls) => {
        const [, value] = match;
        return `.${cls} { column-gap: calc(var(--base-indent) * ${value}); }`;
      },
    },
    {
      selector: '[class*="r-gap-"]',
      classRe: /^r-gap-(\d+)$/,
      render: (match, cls) => {
        const [, value] = match;
        return `.${cls} { row-gap: calc(var(--base-indent) * ${value}); }`;
      },
    },
    {
      selector: '[class*="max-w-"]',
      classRe: /^max-w-(\d+)$/,
      render: (match, cls) => {
        const [, value] = match;
        return `.${cls} { max-width: calc(var(--base-indent) * ${value}); }`;
      },
    },
    {
      selector: '[class*="min-w-"]',
      classRe: /^min-w-(\d+)$/,
      render: (match, cls) => {
        const [, value] = match;
        return `.${cls} { min-width: calc(var(--base-indent) * ${value}); }`;
      },
    },
    {
      selector: '[class*="max-h-"]',
      classRe: /^max-h-(\d+)$/,
      render: (match, cls) => {
        const [, value] = match;
        return `.${cls} { max-height: calc(var(--base-indent) * ${value}); }`;
      },
    },
    {
      selector: '[class*="min-h-"]',
      classRe: /^min-h-(\d+)$/,
      render: (match, cls) => {
        const [, value] = match;
        return `.${cls} { min-height: calc(var(--base-indent) * ${value}); }`;
      },
    },
  ];

  const css = generators
    .map((generator) => {
      const nodes = document.querySelectorAll(generator.selector);
      if (!nodes.length) return "";

      const classes = new Set();
      nodes.forEach((el) => {
        el.classList.forEach((cls) => {
          if (generator.classRe.test(cls)) classes.add(cls);
        });
      });

      if (!classes.size) return "";
      return Array.from(classes)
        .map((cls) => generator.render(cls.match(generator.classRe), cls))
        .join("\n");
    })
    .filter(Boolean)
    .join("\n");

  const existing = document.querySelector('style[data-responsive-dn]');
  if (existing) existing.remove();
  if (!css) return;

  const style = document.createElement("style");
  style.setAttribute("data-responsive-dn", "");
  style.textContent = css;
  (document.body || document.documentElement).appendChild(style);
}

function checkCartDropDownState(e) {
  const cartTrigger = e.target.closest('[data-cart-trigger]');
  const cartDropDown = e.target.closest('[data-cart-dropdown]');

  const carTriggersFromHeader = document.querySelectorAll('.header [data-cart-trigger]');

  if (!cartDropDown&&!cartTrigger) {
    document.documentElement.classList.remove('cart-dropdown-open');

    if (carTriggersFromHeader.length) {
      carTriggersFromHeader.forEach(el => el.classList.remove('_active'));
    }

    return;
  }

  if (cartTrigger) {
    e.preventDefault();
    document.documentElement.classList.toggle('cart-dropdown-open');
    setMinWidth('.cart-header__price');

    if (carTriggersFromHeader.length) {
      carTriggersFromHeader.forEach(el => el.classList.toggle('_active'));
    }
  }
}

function setMinWidth(selector, parent = document) {
  if (typeof selector !== 'string') return;

  const elements = parent.querySelectorAll(selector);
  if (!elements.length) return;

  elements.forEach(element => element.style.removeProperty('--min-width'));
  const widths = [...elements].map(el => el.offsetWidth);
  elements.forEach(element => element.style.setProperty('--min-width', `${Math.max(...widths)}px`));
}

function addYmapScript() {
  const isYMapScriptGlobalInited = Boolean(window[YMAP_SCRIPT_GLOBAL_FLAG]);
  if (window.ymaps3 || isYMapScriptInited || isYMapScriptGlobalInited || document.querySelector(YMAP_SCRIPT_SELECTOR) || document.querySelector('[src*="maps.yandex"]')) return;

  window[YMAP_SCRIPT_GLOBAL_FLAG] = true;
  const key = window.mhzGlobalSettings?.yandexApiKey || '3b73b6bd-d5ae-4676-affb-489f9f1d433f';
  const src = `https://api-maps.yandex.ru/v3/?apikey=${key}&lang=ru_RU`;

  const script = document.createElement('script');
  script.src = src;
  script.setAttribute('data-ymap-loader', '');
  script.async = true;
  script.onerror = () => {
    isYMapScriptInited = false;
    window[YMAP_SCRIPT_GLOBAL_FLAG] = false;
    script.remove();
  };
  script.onload = () => {
    initYaMaps();
  }
  document.head.append(script);
  isYMapScriptInited = true;
}

function initYaMaps() {
  const mapEls = mapSelectors.flatMap(selector => [...document.querySelectorAll(selector)]);

  for (let index = 0; index < mapEls.length; index++) {
    const mapEl = mapEls[index];
    initYaMap(mapEl);
  }
}

async function initYaMap(mapEl) {
  if (!mapEl) return;

  await window.ymaps3?.ready;
  const { YMap, YMapDefaultSchemeLayer, YMapMarker, YMapDefaultFeaturesLayer } = window.ymaps3;
  
  if (!YMap||!YMapDefaultSchemeLayer||!YMapMarker||!YMapDefaultFeaturesLayer) return;

  let { center = "30.338416, 59.832014", zoom = '14', marker } = mapEl.dataset;

  try {
    center = center.split(',').map(el => getDigFromString(el));
    zoom = getDigFromString(zoom);
    if (marker) {
      marker = marker.split(',').map(el => getDigFromString(el));
    }
  } catch (error) {
    console.warn('Ошибка при инициализации карты: ',error);
  }
  
  const map = new YMap(mapEl, {
    location: {
      center,
      zoom,
    },
    behaviors: ["drag", "scrollZoom", "dblClick", "magnifier", "oneFingerZoom", "mouseRotate", "mouseTilt", "pinchRotate", "panTilt"],
  });

  const featuresLayer = new YMapDefaultFeaturesLayer({});
  const schemeLayer = new YMapDefaultSchemeLayer();

  map.addChild(featuresLayer);
  map.addChild(schemeLayer);

  if (marker) {
    const coord = marker;
    const pin = new Image();
    pin.src = (window.mhzGlobalSettings?.templatePath || '/') + 'img/icons/map_pin.svg';
    
    const markerElement = document.createElement('div');
    markerElement.className = 'map-marker';
    markerElement.innerHTML = '';
    markerElement.setAttribute('data-coords', coord.join(', '))
    markerElement.appendChild(pin);
    const mapMarker = new YMapMarker({
      coordinates: coord,
    }, markerElement)

    map.addChild(mapMarker);
  }
}

function formMomentValidateHandler(momentValidationForm) {
  const submitBtn = momentValidationForm.querySelector('[type="submit"]');
  if (!submitBtn) return;

  const errorsCount = formValidate.getErrors(momentValidationForm);
  submitBtn.disabled = errorsCount !== 0
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

const textareaMirrors = new WeakMap();

function getTextareaMirror(textarea) {
  let mirror = textareaMirrors.get(textarea);
  if (mirror) return mirror;

  mirror = document.createElement('div');
  mirror.setAttribute('aria-hidden', 'true');
  mirror.style.position = 'absolute';
  mirror.style.top = '-99999px';
  mirror.style.left = '-99999px';
  mirror.style.visibility = 'hidden';
  mirror.style.pointerEvents = 'none';
  mirror.style.whiteSpace = 'pre-wrap';
  mirror.style.wordWrap = 'break-word';
  mirror.style.overflowWrap = 'break-word';
  document.body.append(mirror);

  textareaMirrors.set(textarea, mirror);
  return mirror;
}

function autoResizeTextarea(textarea, minHeight = 108, maxHeight = 600) {
  if (!textarea) return;
  console.log('autoResizeTextarea');

  const minHeightStyle = getDigFromString(window.getComputedStyle(textarea).getPropertyValue('min-height'));
  if (minHeightStyle) minHeight = minHeightStyle;

  const mirror = getTextareaMirror(textarea);
  const styles = window.getComputedStyle(textarea);
  const mirrorStyleKeys = [
    'boxSizing',
    'width',
    'fontFamily',
    'fontSize',
    'fontWeight',
    'fontStyle',
    'lineHeight',
    'letterSpacing',
    'textTransform',
    'textIndent',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'wordSpacing',
    'tabSize',
    'writingMode'
  ];

  mirrorStyleKeys.forEach(styleKey => {
    mirror.style[styleKey] = styles[styleKey];
  });

  mirror.style.width = `${textarea.offsetWidth}px`;
  mirror.textContent = `${textarea.value || textarea.placeholder || ''}\n`;

  const measuredHeight = mirror.offsetHeight;
  const nextHeight = Math.max(minHeight, Math.min(measuredHeight, maxHeight));
  console.log(nextHeight);
  textarea.style.height = `${nextHeight}px`;
  // textarea.style.height = 'auto';

  // mirror.remove();
  // textareaMirrors.delete(textarea)
}

const autoResizeTextareaDebounced = debounce(autoResizeTextarea, 200);

function onCatalogChaptersTriggerClick(catalogChaptersTrigger) {
  const dropDown = document.querySelector('[data-chapters-catalogfull-dropdown]');
  if (!dropDown) return catalogChaptersTrigger.remove();

  const isActive = !dropDown.hidden;

  if (isActive) {
    catalogChaptersTrigger.classList.remove('_active');
    _slideUp(dropDown);
  } else {
    catalogChaptersTrigger.classList.add('_active');
    _slideDown(dropDown);
  }
}

function onMiniProductMouseOver(miniProduct) {
  const abs = miniProduct.querySelector('.mini-product__abs');
  if (!abs) return;

  miniProduct.style.setProperty('--abs-height', `${abs.offsetHeight / 16}rem`);
}