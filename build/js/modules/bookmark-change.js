import { createCardOnPageBookmarks} from './create-cards.js';

const buttonsСhangeBookmarks = document.querySelectorAll('.products__button-bookmark');

if (buttonsСhangeBookmarks) {
  const linkBookmarks = document.querySelector('.page-header__link-navigation-user--bookmark');
  const numberProductsInBookmark = document.querySelector('.page-header__link-navigation-user--bookmark span:last-child');

  let arrayBookmarks = [];
  /*=============LOCALSTORAGE===========*/
  let isStorageSupport = true;
  let storageNumberBookmarks = '';
  let storageArrayBookmarks = '';

  //получить значения из localStorage
  try {
    storageNumberBookmarks = localStorage.getItem('bookmarks');
    storageArrayBookmarks = JSON.parse(localStorage.getItem('array'));
  } catch (err) {
    isStorageSupport = false;
  }

  if (storageNumberBookmarks || storageArrayBookmarks) {
    if(numberProductsInBookmark) {
      numberProductsInBookmark.textContent = storageNumberBookmarks || '';
      if (+numberProductsInBookmark.textContent > 0) {
        linkBookmarks.classList.add('page-header__link-navigation-user--active');
      }
    }
    arrayBookmarks = storageArrayBookmarks || '';
    buttonsСhangeBookmarks.forEach((buttonСhangeBookmarks) => {
      const item = buttonСhangeBookmarks.closest('.products__item');
      if (storageArrayBookmarks.includes(item.id)) {
        buttonСhangeBookmarks.classList.add('products__button-bookmark--active');
        buttonСhangeBookmarks.textContent = 'В закладках';
      }
    });
    const blockBookmarks = document.querySelector('.bookmarks div:nth-child(2)');
    if (blockBookmarks) {
      arrayBookmarks.forEach((id) => {
        const list = createCardOnPageBookmarks(id);
        blockBookmarks.append(list);
      });
    }
  }

  //установить значения в localStorage
  const  setItemsLocalStorage  = (array, numberBookmark) => {
    if(isStorageSupport) {
      localStorage.setItem('bookmarks', numberBookmark.textContent);
      localStorage.setItem('array', JSON.stringify(array));
    }
  };

  /*=============ДОБАВЛЕНИЕ ТОВАРА В ЗАКЛАДКИ===========*/
  const addToBookmarks = (idProduct, button, numberBookmarks) => {
    arrayBookmarks.push(idProduct);

    linkBookmarks.classList.add('page-header__link-navigation-user--active');

    button.classList.add('products__button-bookmark--active');
    button.textContent = 'В закладках';
    numberBookmarks += 1;
    numberProductsInBookmark.textContent = numberBookmarks;

    setItemsLocalStorage (arrayBookmarks, numberProductsInBookmark);
  };

  /*=============УДАЛЕНИЕ ТОВАРА ИЗ ЗАКЛАДОК===========*/
  const removeFromBookmarks = (idProduct, button, numberBookmarks) => {
    const idIndex = arrayBookmarks.indexOf(idProduct);
    if (idIndex !== -1) {
      arrayBookmarks.splice(idIndex, 1);
    }

    if(arrayBookmarks.length === 0) {
      linkBookmarks.classList.remove('page-header__link-navigation-user--active');
    }

    button.classList.remove('products__button-bookmark--active');
    button.textContent = 'В закладки';
    numberBookmarks -= 1;
    numberProductsInBookmark.textContent = numberBookmarks;

    setItemsLocalStorage (arrayBookmarks, numberProductsInBookmark);
  };

  /*=============ИЗМЕНИТЬ КОЛИЧЕСТВО ЗАКЛАДОК===========*/
  const changeBookmarks = (buttonSelected) => {
    const productSelected = buttonSelected.closest('.products__item');
    const idProductSelected = productSelected.id;
    const numberBookmarksInitial = + numberProductsInBookmark.textContent;

    if(arrayBookmarks.length === 0) {
      addToBookmarks(idProductSelected, buttonSelected, numberBookmarksInitial);
      return;
    }

    arrayBookmarks.includes(idProductSelected) ?  removeFromBookmarks(idProductSelected, buttonSelected, numberBookmarksInitial) : addToBookmarks(idProductSelected, buttonSelected, numberBookmarksInitial );
  };

  //Обработчики
  const onButtonСhangeBookmarksClick = (evt) => {
    changeBookmarks(evt.target);
  };

  buttonsСhangeBookmarks.forEach((buttonСhangeBookmarks) => {
    buttonСhangeBookmarks.disabled = false;
    buttonСhangeBookmarks.addEventListener('click', onButtonСhangeBookmarksClick);
  });
}
