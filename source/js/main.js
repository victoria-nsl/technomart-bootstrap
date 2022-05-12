import './modules/utils.js';
import './modules/navigation.js';
import './modules/tab.js';
import './modules/form-validation.js';
import './modules/popup.js';
import './modules/object-product.js';
import './modules/create-cards.js';
import './modules/bookmark-change.js';
import './modules/cart-change.js';
import './modules/cart-change-quantity.js';
import './modules/slider.js';

//Карусель (сделана с помощью библиотеки bootstrap). Кнопки не видны при неработающем js
const carousel =  document.querySelector('.about__carousel');

if (carousel) {
  const buttonsPrevCarousel = carousel.querySelector('.about__carousel-control--prev');
  const buttonsNextCarousel = carousel.querySelector('.about__carousel-control--next');

  buttonsPrevCarousel.disabled = false;
  buttonsNextCarousel.disabled = false;
}


//Временный  код для входа в личный кабинет/выхода из личного кабинета (без окна с паролем)
const wrapperBlocksLogin = document.querySelector('.page-header__wrapper-login-cabinet');

if (wrapperBlocksLogin) {
  const blocksLogin = wrapperBlocksLogin.querySelectorAll('.page-header__wrapper-login');
  const buttonFromPersonalCabinet = wrapperBlocksLogin.querySelector('.page-header__link-exit');
  const buttonToPersonalCabinet = wrapperBlocksLogin.querySelector('.page-header__link-login');

  const changeBlock = (button) => {
    if(button.closest('a')) {

      blocksLogin.forEach((blockLogin) => {
        blockLogin.classList.toggle('page-header__wrapper-login--active');
      });
    }
  };

  const onButtonToPersonalCabinetClick = (evt) => {
    changeBlock(evt.target);
  };

  const onButtonFromPersonalCabinetClick = (evt) => {
    changeBlock(evt.target);
  };

  buttonToPersonalCabinet.addEventListener('click', onButtonToPersonalCabinetClick);
  buttonFromPersonalCabinet.addEventListener('click', onButtonFromPersonalCabinetClick);
}
