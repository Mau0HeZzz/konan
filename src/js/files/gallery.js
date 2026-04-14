/*
Документация по работе в шаблоне: https://www.lightgalleryjs.com/docs/
Документация плагина: https://www.lightgalleryjs.com/docs/
Сниппет(HTML):
*/

// Подключение функционала "Чертоги Фрилансера"
import { isMobile, FLS } from "./functions.js";
// Подключение списка активных модулей
import { mhzModules } from "./modules.js";

// Подключение базового набора функционала
import lightGallery from 'lightgallery';

// Плагины
// lgZoom, lgAutoplay, lgComment, lgFullscreen, lgHash, lgPager, lgRotate, lgShare, lgThumbnail, lgVideo, lgMediumZoom
import lgThumbnail from 'lightgallery/plugins/thumbnail/lg-thumbnail.min.js';
import lgZoom from 'lightgallery/plugins/zoom/lg-zoom.min.js';
import lgVideo from 'lightgallery/plugins/video/lg-video.min.js';

// Базовые стили
// import '@scss/libs/gallery/lightgallery.scss';
// Стили дополнений
// import '@scss/libs/gallery/lg-thumbnail.scss';
// import '@scss/libs/gallery/lg-video.scss';
// import '@scss/libs/gallery/lg-autoplay.scss';
// import '@scss/libs/gallery/lg-zoom.scss';
// import '@scss/libs/gallery/lg-pager.scss';
// import '@scss/libs/gallery/lg-fullscreen.scss';
// import '@scss/libs/gallery/lg-share.scss';
// import '@scss/libs/gallery/lg-comments.scss';s
// import '@scss/libs/gallery/lg-rotate.scss';
// import '@scss/libs/gallery/lg-medium-zoom.scss';
// import '@scss/libs/gallery/lg-relative-caption.scss';

// Все стили
import '/src/scss/libs/gallery/lightgallery-bundle.scss';

const isIframeSlide = (galleryClass, index) => {
	return Boolean(galleryClass.galleryItems[index]?.iframe);
}

const getGallerySlide = (galleryClass, index) => {
	if (index < 0) return null;

	const slideItem = galleryClass.getSlideItem(index);
	return slideItem?.get() ? slideItem : null;
}

const unloadIframeSlide = (galleryClass, index) => {
	if (!isIframeSlide(galleryClass, index)) return;

	const slideItem = getGallerySlide(galleryClass, index);
	if (!slideItem) return;

	slideItem.find('.lg-has-iframe').remove();
	slideItem.find('.lg-error-msg').remove();
	slideItem.removeClass('lg-loaded lg-complete lg-complete_');
}

const unloadInactiveIframes = (galleryClass, activeIndex) => {
	galleryClass.galleryItems.forEach((item, index) => {
		if (!item?.iframe || index === activeIndex) return;

		unloadIframeSlide(galleryClass, index);
	})
}

const unloadAllIframes = (galleryClass) => {
	galleryClass.galleryItems.forEach((item, index) => {
		if (!item?.iframe) return;

		unloadIframeSlide(galleryClass, index);
	})
}

// Запуск
const galleries = document.querySelectorAll('[data-gallery]');
if (galleries.length) {
	let galleyItems = [];
	galleries.forEach(gallery => {
		const galleryClass = lightGallery(gallery, {
			plugins: [lgZoom, lgThumbnail, lgVideo],
			licenseKey: '7EC452A9-0CFD441C-BD984C7C-17C8456E',
			speed: 500,
			selector: 'a',
		})

		gallery.addEventListener('lgAfterSlide', (event) => {
			unloadInactiveIframes(galleryClass, event.detail.index);
		})

		// lightGallery can preload соседние слайды после загрузки активного.
		// Для iframe очищаем всё лишнее, чтобы в DOM оставался только текущий.
		gallery.addEventListener('lgSlideItemLoad', () => {
			unloadInactiveIframes(galleryClass, galleryClass.index);
		})

		gallery.addEventListener('lgBeforeClose', () => {
			unloadAllIframes(galleryClass);
		})

		galleyItems.push({
			gallery,
			galleryClass
		})
	});
	// Добавляем в объект модулей
	mhzModules.gallery = galleyItems;
}
