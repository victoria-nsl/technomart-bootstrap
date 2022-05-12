import { isEscEvent, setFocusTab } from './utils.js';

const page = document.body;
const popupLost = document.querySelector('.popup-lost');
const popupMap = document.querySelector('.popup-map');
const formSearch = document.querySelector('.page-header__form');
const popupCart = document.querySelector('.popup-cart');

/*============Закрытие попапа===============*/
const closePopup = (popup) => {
  popup.classList.remove('popup--opened');
  page.classList.remove('page--no-scroll');
};

/*=========Открытие попапа===========*/

const openPopup = (popup, firstElementPopupFocusable, lastElementPopupFocusable) => {
  popup.classList.add('popup--opened');
  page.classList.add('page--no-scroll');
  firstElementPopupFocusable.focus();
  firstElementPopupFocusable.addEventListener('keydown', (evt) => {
    setFocusTab(evt, firstElementPopupFocusable, lastElementPopupFocusable);
  });
  lastElementPopupFocusable.addEventListener('keydown', (evt) => {
    setFocusTab(evt, firstElementPopupFocusable, lastElementPopupFocusable);
  });
};

/*========= Oбработчик клика на попапе===========*/
const onPopupClick = (evt) => {
  if (evt.target.matches('.popup')) {
    closePopup(evt.target);
  }
};


/*============МОДАЛЬНОЕ ОКНО "ЗАБЛУДИЛИСЬ? НАПИШИТЕ НАМ"===============*/
if (popupLost) {
  const buttonOpenPopupLost = document.querySelector('.contacts__link');
  const buttonClosePopupLost = popupLost.querySelector('.popup__button-close');

  const elementsPopupLostFocusable = popupLost.querySelectorAll('input, textarea, button');
  const firstElementPopupLostFocusable = elementsPopupLostFocusable[0];
  const lastElementPopupLostFocusable = elementsPopupLostFocusable[[elementsPopupLostFocusable.length - 1]];

  const onDocumentKeydown = (evt) => {
    if (isEscEvent(evt)) {
      closePopup(popupLost);
      document.removeEventListener('keydown', onDocumentKeydown);
    }
  };

  const onButtonClosePopupLostClick = () => {
    closePopup(popupLost);
  };

  const onButtonOpenPopupLostClick = (evt) => {
    evt.preventDefault();
    openPopup(popupLost, firstElementPopupLostFocusable, lastElementPopupLostFocusable);
    document.addEventListener('keydown', onDocumentKeydown);
    popupLost.addEventListener('click', onPopupClick);
    buttonClosePopupLost.addEventListener('click', onButtonClosePopupLostClick);
  };

  buttonOpenPopupLost.addEventListener('click', onButtonOpenPopupLostClick);
}
/*============МОДАЛЬНОЕ ОКНО С КАРТОЙ===============*/
if (popupMap) {
  const buttonOpenPopupMap = document.querySelector('.contacts__map-button');
  const buttonClosePopupMap = popupMap.querySelector('.popup__button-close');


  const elementsPopupMapFocusable = popupMap.querySelectorAll('iframe, button');
  const firstElementPopupMapFocusable = elementsPopupMapFocusable[0];
  const lastElementPopupMapFocusable = elementsPopupMapFocusable[[elementsPopupMapFocusable.length - 1]];

  /*=========Открытие модального окна и обработчики при открытом окне===========*/
  const onDocumentKeydown = (evt) => {
    if (isEscEvent(evt)) {
      closePopup(popupMap);
      document.removeEventListener('keydown', onDocumentKeydown);
    }
  };

  const onButtonClosePopupMapClick = () => {
    closePopup(popupMap);
  };

  const onButtonOpenPopupMapClick = (evt) => {
    evt.preventDefault();
    openPopup(popupMap, firstElementPopupMapFocusable, lastElementPopupMapFocusable);
    document.addEventListener('keydown', onDocumentKeydown);
    popupMap.addEventListener('click', onPopupClick);
    buttonClosePopupMap.addEventListener('click', onButtonClosePopupMapClick);
  };

  buttonOpenPopupMap.disabled = false;
  buttonOpenPopupMap.addEventListener('click', onButtonOpenPopupMapClick);
}

/*============МОДАЛЬНОЕ ОКНО С ПОИСКОМ===============*/
if (formSearch) {
  const buttonOpenPopupSearch = formSearch.querySelector('.page-header__button-search');

  const popupSearch = formSearch.querySelector('.popup-search');
  const buttonClosePopupSearch = popupSearch.querySelector('.popup__button-close');
  const buttonSubmitRequest = popupSearch.querySelector('.page-header__button-submit');


  const elementsPopupSearchFocusable = popupSearch.querySelectorAll('input, button');
  const firstElementPopupSearchFocusable = elementsPopupSearchFocusable[0];
  const lastElementPopupSearchFocusable = elementsPopupSearchFocusable[[elementsPopupSearchFocusable.length - 1]];

  formSearch.classList.remove('page-header__form--nojs');
  popupSearch.classList.remove('popup-search--nojs');

  const onDocumentKeydown = (evt) => {
    if (isEscEvent(evt)) {
      closePopup(popupSearch);
      document.removeEventListener('keydown', onDocumentKeydown);
    }
  };

  const onButtonClosePopupSearchClick = () => {
    closePopup(popupSearch);
  };

  const onButtonSubmitRequestClick = () => {
    closePopup(popupSearch);
  };

  const onButtonOpenPopupSearchClick = () => {
    openPopup(popupSearch, firstElementPopupSearchFocusable, lastElementPopupSearchFocusable);
    document.addEventListener('keydown', onDocumentKeydown);
    buttonSubmitRequest.addEventListener('click', onButtonSubmitRequestClick);
    buttonClosePopupSearch.addEventListener('click', onButtonClosePopupSearchClick);
  };

  buttonOpenPopupSearch.addEventListener('click', onButtonOpenPopupSearchClick);
}

/*============МОДАЛЬНОЕ ОКНО С ТОВАР ДОБАВЛЕН В КОРЗИНУ===============*/
if (popupCart) {
  const listProducts = document.querySelector('.products__list');
  const buttonsBuy = listProducts.querySelectorAll('.products__button-buy');
  const buttonClosePopupCart = popupCart.querySelector('.popup__button-close');

  const elementsPopupCartFocusable = popupCart.querySelectorAll('a, button');
  const firstElementPopupCartFocusable = elementsPopupCartFocusable[0];
  const lastElementPopupCartFocusable = elementsPopupCartFocusable[[elementsPopupCartFocusable.length - 1]];

  buttonsBuy.forEach((buttonBuy) => {
    buttonBuy.disabled = false;
  });

  const onDocumentKeydown = (evt) => {
    if (isEscEvent(evt)) {
      closePopup(popupCart);
      document.removeEventListener('keydown', onDocumentKeydown);
    }
  };

  const onButtonClosePopupCartClick = () => {
    closePopup(popupCart);
  };

  const onButtonOpenPopupCartClick = (evt) => {
    if (evt.target.matches('.products__button-buy') || evt.target.matches('.products__button-buy svg') || evt.target.matches('.products__button-buy span')) {
      evt.preventDefault();
      if(!evt.target.closest('button').classList.contains('products__button-buy--active')) {
        openPopup(popupCart, firstElementPopupCartFocusable, lastElementPopupCartFocusable);
        document.addEventListener('keydown', onDocumentKeydown);
        popupCart.addEventListener('click', onPopupClick);
        buttonClosePopupCart.addEventListener('click', onButtonClosePopupCartClick);
      }
    }
  };

  listProducts.addEventListener('click', onButtonOpenPopupCartClick);
}

export {closePopup};
