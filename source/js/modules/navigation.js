import {setFocusTab} from './utils.js';

const WIDTH_TABLET = 768;

const page = document.body;
const menu = document.querySelector('.page-header');

/*======ОТКРЫТИЕ/ЗАКРЫТИЕ МОБИЛЬНОГО МЕНЮ ============*/
const closeMenu = () => {
  menu.classList.add('page-header--closed');
  menu.classList.remove('page-header--opened');
  page.classList.remove('page--no-scroll');
};

const openMenu = () => {
  menu.classList.remove('page-header--closed');
  menu.classList.add('page-header--opened');
  page.classList.add('page--no-scroll');
};

if (menu && page.clientWidth <  WIDTH_TABLET) {
  const navigationToggle = menu.querySelector('.page-header__toggle');
  const navigation =  menu.querySelector('.page-header__navigation');
  const elementsFocusable = navigation.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');

  const numberElements = elementsFocusable.length;
  const firstFocusElement = elementsFocusable[0];
  const lastFocusElement = elementsFocusable[numberElements - 1];


  menu.classList.remove('page-header--nojs');
  navigationToggle.addEventListener('click', () => {
    if (menu.classList.contains('page-header--closed')) {
      openMenu();
      return;
    }
    closeMenu();
  });

  firstFocusElement.addEventListener('keydown', (evt) => {
    setFocusTab(evt, firstFocusElement, lastFocusElement);
  });

  lastFocusElement.addEventListener('keydown', (evt) => {
    setFocusTab(evt, firstFocusElement, lastFocusElement);
  });
}
