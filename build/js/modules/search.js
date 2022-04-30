import {isEscEvent, setFocusTab} from './utils.js';

const formSearch = document.querySelector('.page-header__form');
const page = document.body;

if(formSearch) {
  const buttonOpenPopupInput = formSearch.querySelector('.page-header__button-search');

  const popupInput = formSearch.querySelector('.page-header__popup');
  const buttonSubmitRequest =  popupInput.querySelector('.page-header__button-submit');
  const buttonClosePopupInput =  popupInput.querySelector('.page-header__button-close-popup');

  const elementsPopupInputFocusable = popupInput.querySelectorAll('input, button');
  const firstElementPopupInputFocusable = elementsPopupInputFocusable[0];
  const lastElementPopupInputFocusable = elementsPopupInputFocusable[[elementsPopupInputFocusable.length-1]];

  const closePopupInput = () => {
    page.classList.remove('page--no-scroll');
    popupInput.classList.remove('page-header__popup--opened');
  };

  const onDocumentKeydown = (evt) => {
    if(isEscEvent(evt)) {
      closePopupInput();
      document.removeEventListener('keydown', onDocumentKeydown);
    }
  };

  const onElementFocusableKeydown = (evt) => {
    setFocusTab(evt, firstElementPopupInputFocusable, lastElementPopupInputFocusable);
  };

  const openPopupInput = () => {
    page.classList.add('page--no-scroll');
    popupInput.classList.add('page-header__popup--opened');

    firstElementPopupInputFocusable.focus();
    firstElementPopupInputFocusable.addEventListener('keydown', onElementFocusableKeydown);
    lastElementPopupInputFocusable.addEventListener('keydown', onElementFocusableKeydown);

    document.addEventListener('keydown', onDocumentKeydown);
  };

  const onButtonClosePopupInputClick= () => {
    closePopupInput();
  };

  const onButtonSubmitRequestClick = () => {
    closePopupInput();
  };

  const onButtonOpenPopupInputClick = () => {
    openPopupInput();
  };

  buttonOpenPopupInput.addEventListener('click', onButtonOpenPopupInputClick);
  buttonSubmitRequest.addEventListener('click', onButtonSubmitRequestClick);
  buttonClosePopupInput.addEventListener('click', onButtonClosePopupInputClick);
}
