const menu = document.querySelector('.page-header');

/*======ОТКРЫТИЕ/ЗАКРЫТИЕ МОБИЛЬНОГО МЕНЮ ============*/
const closeMenu = () => {
  menu.classList.add('page-header--closed');
  menu.classList.remove('page-header--opened');
};

const openMenu = () => {
  menu.classList.remove('page-header--closed');
  menu.classList.add('page-header--opened');

};

if (menu) {
  const navigationToggle = menu.querySelector('.page-header__toggle');

  menu.classList.remove('page-header--nojs');

  const onNavigationToggleClick = () => {
    if (menu.classList.contains('page-header--closed')) {
      openMenu();
      return;
    }
    closeMenu();
  };

  navigationToggle.addEventListener('click', onNavigationToggleClick);
}
