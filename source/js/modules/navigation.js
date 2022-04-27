import {isEscEvent, setFocusTab} from './utils.js';

const TABLET_DESKTOP = 767;

const page = document.body;
const menu = document.querySelector('.page-header');
const anchorsLinks = document.querySelectorAll('[data-link-anchors]');


/*======ОТКРЫТИЕ/ЗАКРЫТИЕ МОБИЛЬНОГО МЕНЮ И ПЛАВНЫЙ СКРОЛЛ============*/

//открытие-закрытие меню
const closeMenu = () => {
  menu.classList.add('page-header--closed');
  menu.classList.remove('page-header--opened');
  page.classList.remove('page--no-scroll');
};

if (menu && page.clientWidth < TABLET_DESKTOP) {
  const navigationToggle = menu.querySelector('.page-header__toggle');
  const elementsFocusable = menu.querySelectorAll('[data-link-menu]');


  const numberElements = elementsFocusable.length;
  const firstFocusElement = elementsFocusable[0];
  const lastFocusElement = elementsFocusable[numberElements - 1];

  menu.classList.remove('page-header--nojs');

  const onDocumentKeydown = (evt) => {
    if(isEscEvent(evt)) {
      closeMenu();
      document.removeEventListener('keydown', onDocumentKeydown);
    }
  };

  const onElementFocusableKeydown = (evt) => {
    setFocusTab(evt, firstFocusElement, lastFocusElement);
  };

  const openMenu = () => {
    menu.classList.remove('page-header--closed');
    menu.classList.add('page-header--opened');
    page.classList.add('page--no-scroll');

    firstFocusElement.focus();
    firstFocusElement.addEventListener('keydown', onElementFocusableKeydown);
    lastFocusElement.addEventListener('keydown', onElementFocusableKeydown);

    document.addEventListener('keydown', onDocumentKeydown);
  };

  const onNavigationToggleClick = () => {
    if (menu.classList.contains('page-header--closed')) {
      openMenu();
      return;
    }
    closeMenu();
  };

  navigationToggle.addEventListener('click', onNavigationToggleClick);

}

//плавный скролл
if (anchorsLinks) {

  const onAnchorLinkClick = (evt) => {
    evt.preventDefault();

    const blockId = evt.target.getAttribute('href').substr(1); //substring()

    document.getElementById(blockId).scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    if (menu.classList.contains('page-header--opened')) {
      closeMenu();
    }
  };

  anchorsLinks.forEach((anchorLink) => {
    anchorLink.addEventListener('click',  onAnchorLinkClick);
  });
}
