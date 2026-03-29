import {Splide} from '@splidejs/splide';
// Default theme
// import '@splidejs/splide/css';

// or only core styles
import '@splidejs/splide/css/core';



function initSliders() {
  // if (document.querySelector('.splide')) {
  //   let splide = new Splide('.splide', {
  //     type: 'slide',
  //     pagination: false,
  //     gap: 10,
  //     arrows: true,
  //     perMove: 1,
  //     perPage: 1,
  //   })
    
  //   splide.mount();
  // }
  if (document.querySelector('.reviews__slider')) {
    let splide = new Splide('.reviews__slider', {
      type: 'slide',
      pagination: false,
      gap: 10,
      arrows: true,
      perMove: 1,
      autoWidth: true
    })
    
    splide.mount();
  }

  if (document.querySelector('.clients__slider')) {
    let splide = new Splide('.clients__slider', {
      type: 'loop',
      pagination: false,
      gap: 10,
      arrows: true,
      perMove: 1,
      autoWidth: true
    })
    
    splide.mount();
  }

  if (document.querySelector('.media-productfull__slider')) {
    const mainSliderEl = document.querySelector('.media-productfull__slider');
    const thumbSliderEl = document.querySelector('.media-productfull__thumbslider');

    let mainSlider, thumbSlider;

    if (mainSliderEl) {
      mainSlider = new Splide(mainSliderEl, {
        perPage: 1,
        perMove: 1,
        gap: 10,
        arrows: false,
        pagination: false,
      })
    }

    if (thumbSliderEl) {
      thumbSlider = new Splide(thumbSliderEl, {
        fixedWidth: `${54 / 16}rem`,
        height: `${54 / 16}rem`,
        fixedHeight: `${54 / 16}rem`,
        gap: 10,
        // rewind: true,
        pagination: false,
        isNavigation: true,
        breakpoints: {
          767: {
            fixedWidth: `${44 / 16}rem`,
            height: `${44 / 16}rem`,
            fixedHeight: `${44 / 16}rem`,
          }
        }
      })
    }

    if (thumbSlider) mainSlider.sync(thumbSlider);
    mainSlider.mount();
    if (thumbSlider) thumbSlider.mount();
  }
}


window.addEventListener("load", function (e) {
	initSliders();
});
