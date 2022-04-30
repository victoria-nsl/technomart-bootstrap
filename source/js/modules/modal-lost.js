import { isEscEvent, setFocusTab } from './utils.js';

const page = document.body;
const modal = document.querySelector('.modal-lost');


/*============Закрытие модального окна===============*/
const closeModal = () => {
  modal.classList.remove('modal-lost--opened');
  page.classList.remove('page--no-scroll');
};

if (modal) {
  const buttonOpenPopup = document.querySelector('.contacts__link');
  const buttonClosePopup = modal.querySelector('.modal-lost__button-close');

  const elementsPopupFocusable = modal.querySelectorAll('input, textarea, button');
  const firstElementPopupFocusable = elementsPopupFocusable[0];
  const lastElementPopupFocusable = elementsPopupFocusable[[elementsPopupFocusable.length - 1]];

  /*=========Открытие модального окна и обработчики при открытом окне===========*/
  const onDocumentKeydown = (evt) => {
    if (isEscEvent(evt)) {
      closeModal();
      document.removeEventListener('keydown', onDocumentKeydown);
    }
  };

  const onPopupClick = (evt) => {
    if (evt.target.matches('.modal-lost')) {
      closeModal();
    }
  };

  const onElementFocusableKeydown = (evt) => {
    setFocusTab(evt, firstElementPopupFocusable, lastElementPopupFocusable);
  };

  const openPopup = () => {
    modal.classList.add('modal-lost--opened');
    page.classList.add('page--no-scroll');
    firstElementPopupFocusable.focus();

    document.addEventListener('keydown', onDocumentKeydown);

    modal.addEventListener('click', onPopupClick);
    firstElementPopupFocusable.addEventListener('keydown', onElementFocusableKeydown);
    lastElementPopupFocusable.addEventListener('keydown', onElementFocusableKeydown);
  };

  /*====================Обработчики для открытия/закрытия окна=================*/

  const onButtonClosePopupClick = () => {
    closeModal();
  };

  const onButtonOpenPopupClick = (evt) => {
    evt.preventDefault();
    openPopup();
  };

  buttonClosePopup.addEventListener('click', onButtonClosePopupClick);
  buttonOpenPopup.addEventListener('click', onButtonOpenPopupClick);
}
