import {isEscEvent, setFocusTab} from './utils.js';

const formSearch = document.querySelector('.page-header__form');
const page = document.body;

if(formSearch) {
  const buttonOpenPopupSearch = formSearch.querySelector('.page-header__button-search');

  const popupSearch = formSearch.querySelector('.page-header__popup');
  const buttonSubmitRequest =  popupSearch.querySelector('.page-header__button-submit');
  const buttonClosePopupSearch =  popupSearch.querySelector('.page-header__button-close-popup');

  const elementsPopupSearchFocusable = popupSearch.querySelectorAll('input, button');
  const firstElementPopupSearchFocusable = elementsPopupSearchFocusable[0];
  const lastElementPopupSearchFocusable = elementsPopupSearchFocusable[[elementsPopupSearchFocusable.length-1]];

  const closePopupSearch = () => {
    page.classList.remove('page--no-scroll');
    popupSearch.classList.remove('page-header__popup--opened');
  };

  const onDocumentKeydown = (evt) => {
    if(isEscEvent(evt)) {
      closePopupSearch();
      document.removeEventListener('keydown', onDocumentKeydown);
    }
  };

  const onElementFocusableKeydown = (evt) => {
    setFocusTab(evt, firstElementPopupSearchFocusable, lastElementPopupSearchFocusable);
  };

  const openPopupSearch = () => {
    page.classList.add('page--no-scroll');
    popupSearch.classList.add('page-header__popup--opened');

    firstElementPopupSearchFocusable.focus();
    firstElementPopupSearchFocusable.addEventListener('keydown', onElementFocusableKeydown);
    lastElementPopupSearchFocusable.addEventListener('keydown', onElementFocusableKeydown);

    document.addEventListener('keydown', onDocumentKeydown);
  };

  const onButtonClosePopupSearchClick= () => {
    closePopupSearch();
  };

  const onButtonSubmitRequestClick = () => {
    closePopupSearch();
  };

  const onButtonOpenPopupSearchClick = () => {
    openPopupSearch();
  };

  buttonOpenPopupSearch.addEventListener('click', onButtonOpenPopupSearchClick);
  buttonSubmitRequest.addEventListener('click', onButtonSubmitRequestClick);
  buttonClosePopupSearch.addEventListener('click', onButtonClosePopupSearchClick);
}
