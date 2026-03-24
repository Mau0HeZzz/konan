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
}


window.addEventListener("load", function (e) {
	initSliders();
});
