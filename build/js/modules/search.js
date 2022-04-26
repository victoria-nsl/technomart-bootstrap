import {isEscEvent, setFocusTab} from './utils.js';

const formSearch = document.querySelector('.page-header__form');
const page = document.body;

if(formSearch) {
  const buttonOpenInput = formSearch.querySelector('.page-header__button-search');
  const buttonSubmitRequest = formSearch.querySelector('.page-header__button-submit');
  const buttonCloseInput = formSearch.querySelector('.page-header__button-close-popup');
  const popupInput = formSearch.querySelector('.page-header__wrapper-popup');

  const elementsPopupFocusable = popupInput.querySelectorAll('input, button');
  const firstElementPopupFocusable = elementsPopupFocusable[0];
  const lastElementPopupFocusable = elementsPopupFocusable[[elementsPopupFocusable.length-1]];

  const closePopupInput = () => {
    page.classList.remove('page--no-scroll');
    popupInput.classList.remove('page-header__wrapper-popup--active');
  };

  const onDocumentKeydown = (evt) => {
    if(isEscEvent(evt)) {
      closePopupInput();
      document.removeEventListener('keydown', onDocumentKeydown);
    }
  };

  const onElementFocusableKeydown = (evt) => {
    setFocusTab(evt, firstElementPopupFocusable, lastElementPopupFocusable);
  };

  const openPopupInput = () => {
    page.classList.add('page--no-scroll');
    popupInput.classList.add('page-header__wrapper-popup--active');

    firstElementPopupFocusable.focus();
    firstElementPopupFocusable.addEventListener('keydown', onElementFocusableKeydown);
    lastElementPopupFocusable.addEventListener('keydown', onElementFocusableKeydown);

    document.addEventListener('keydown', onDocumentKeydown);
  };

  const onButtonCloseInput = () => {
    closePopupInput();
  };

  const onButtonSubmitRequest = () => {
    closePopupInput();
  };

  const onButtonOpenInputClick = () => {
    openPopupInput();
  };

  buttonOpenInput.addEventListener('click', onButtonOpenInputClick);
  buttonSubmitRequest.addEventListener('click', onButtonSubmitRequest);
  buttonCloseInput.addEventListener('click', onButtonCloseInput);
}
