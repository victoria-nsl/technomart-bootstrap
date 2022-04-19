const blockSlides = document.querySelector('.service__description');

if ( blockSlides) {

  const listButtons = blockSlides.querySelector('.service__list-buttons');
  const buttonsSlides = blockSlides.querySelectorAll('.service__button');
  const slides = blockSlides.querySelectorAll('.service__item-tab');


  listButtons.classList.remove('service__list-buttons--nojs');
  slides.forEach((slide) => {
    slide.classList.remove('service__item-tab--nojs');
  });


  const onButtonSlideClick = (evt) => {
    if (evt.target.tagName === 'BUTTON') {

      let indexButton;

      buttonsSlides.forEach((buttonSlide, index) => {
        if (buttonSlide === evt.target) {
          indexButton = index;
        }
        buttonSlide.classList.remove('service__button--active');
      });

      slides.forEach((slide) => {
        slide.classList.remove('service__item-tab--active');
      });

      evt.target.classList.add('service__button--active');
      slides[indexButton].classList.add('service__item-tab--active');
    }
  };

  listButtons.addEventListener('click', onButtonSlideClick);
}
