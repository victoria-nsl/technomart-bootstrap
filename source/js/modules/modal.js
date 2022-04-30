import { isEscEvent, setFocusTab } from './utils.js';

const page = document.body;
const modalLost = document.querySelector('.modal-lost');
const modalMap = document.querySelector('.modal-map');
const modalSearch = document.querySelector('.modal-search');

/*============Закрытие попапа===============*/
const closePopup = (modal) => {
  modal.classList.remove('modal--opened');
  page.classList.remove('page--no-scroll');
};

/*=========Открытие попапа и обработчик клика на попапе===========*/
const onPopupClick = (evt) => {
  if (evt.target.matches('.modal')) {
    closePopup(evt.target);
  }
};

const openPopup = (modal, firstElementPopupFocusable, lastElementPopupFocusable) => {
  modal.classList.add('modal--opened');
  page.classList.add('page--no-scroll');
  firstElementPopupFocusable.focus();

  modal.addEventListener('click', onPopupClick);

  firstElementPopupFocusable.addEventListener('keydown', (evt) => {
    setFocusTab(evt, firstElementPopupFocusable, lastElementPopupFocusable);
  });
  lastElementPopupFocusable.addEventListener('keydown', (evt) => {
    setFocusTab(evt, firstElementPopupFocusable, lastElementPopupFocusable);
  });
};


/*============МОДАЛЬНОЕ ОКНО "ЗАБЛУДИЛИСЬ? НАПИШИТЕ НАМ"===============*/
if (modalLost) {
  const buttonOpenPopupLost = document.querySelector('.contacts__link');
  const buttonClosePopupLost = modalLost.querySelector('.modal__button-close');

  const elementsPopupLostFocusable = modalLost.querySelectorAll('input, textarea, button');
  const firstElementPopupLostFocusable = elementsPopupLostFocusable[0];
  const lastElementPopupLostFocusable = elementsPopupLostFocusable[[elementsPopupLostFocusable.length - 1]];

  const onDocumentKeydown = (evt) => {
    if (isEscEvent(evt)) {
      closePopup(modalLost);
      document.removeEventListener('keydown', onDocumentKeydown);
    }
  };

  const onButtonClosePopupLostClick = () => {
    closePopup(modalLost);
  };

  const onButtonOpenPopupLostClick = (evt) => {
    evt.preventDefault();
    openPopup(modalLost, firstElementPopupLostFocusable, lastElementPopupLostFocusable);
    document.addEventListener('keydown', onDocumentKeydown);
  };

  buttonClosePopupLost.addEventListener('click', onButtonClosePopupLostClick);
  buttonOpenPopupLost.addEventListener('click', onButtonOpenPopupLostClick);

}
/*============МОДАЛЬНОЕ ОКНО С КАРТОЙ===============*/
if (modalMap) {
  const buttonOpenPopupMap = document.querySelector('.contacts__map-button');
  const buttonClosePopupMap = modalMap.querySelector('.modal__button-close');

  const elementsPopupMapFocusable = modalMap.querySelectorAll('iframe, button');
  const firstElementPopupMapFocusable = elementsPopupMapFocusable[0];
  const lastElementPopupMapFocusable = elementsPopupMapFocusable[[elementsPopupMapFocusable.length - 1]];

  /*=========Открытие модального окна и обработчики при открытом окне===========*/
  const onDocumentKeydown = (evt) => {
    if (isEscEvent(evt)) {
      closePopup(modalMap);
      document.removeEventListener('keydown', onDocumentKeydown);
    }
  };

  const onButtonClosePopupClick = () => {
    closePopup(modalMap);
  };

  const onButtonOpenPopupClick = (evt) => {
    evt.preventDefault();
    openPopup(modalMap, firstElementPopupMapFocusable, lastElementPopupMapFocusable);
    document.addEventListener('keydown', onDocumentKeydown);
  };

  buttonClosePopupMap.addEventListener('click', onButtonClosePopupClick);
  buttonOpenPopupMap.addEventListener('click', onButtonOpenPopupClick);
}

/*============МОДАЛЬНОЕ ОКНО С ПОИСКОМ===============*/

if(modalSearch) {
  const buttonOpenPopupSearch = document.querySelector('.page-header__button-search');
  const buttonSubmitRequest = modalSearch.querySelector('.page-header__button-submit');
  const buttonClosePopupSearch = modalSearch.querySelector('.modal__button-close');


  const elementsPopupSearchFocusable = modalSearch.querySelectorAll('input, button');
  const firstElementPopupSearchFocusable = elementsPopupSearchFocusable[0];
  const lastElementPopupSearchFocusable = elementsPopupSearchFocusable[[elementsPopupSearchFocusable.length-1]];

  const onDocumentKeydown = (evt) => {
    if(isEscEvent(evt)) {
      closePopup(modalSearch);
      document.removeEventListener('keydown', onDocumentKeydown);
    }
  };

  const onButtonClosePopupSearchClick = () => {
    closePopup(modalSearch);
  };

  const onButtonSubmitRequestClick = () => {
    closePopup(modalSearch);
  };

  const onButtonPopupSearchClick = () => {
    openPopup(modalSearch,firstElementPopupSearchFocusable, lastElementPopupSearchFocusable);
    document.addEventListener('keydown', onDocumentKeydown);
  };

  buttonOpenPopupSearch.addEventListener('click', onButtonPopupSearchClick);
  buttonSubmitRequest.addEventListener('click', onButtonSubmitRequestClick);
  buttonClosePopupSearch .addEventListener('click', onButtonClosePopupSearchClick);
}
