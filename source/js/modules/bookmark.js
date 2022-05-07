const buttonsСhangeBookmarks = document.querySelectorAll('.products__button-bookmark');

//const listBookmarks =document.createElement('div');
//listBookmarks.classList.add('bookmark__list');
let arrayBookmarks = [];

const linkBookmarks = document.querySelector('.page-header__link-navigation-user--bookmark');
const numberProductsInBookmark = linkBookmarks.querySelector('.page-header__link-navigation-user--bookmark span:last-child');

/*=============LOCALSTORAGE===========*/
let isStorageSupport = true;
let storageNumberBookmarks = '';
let storageArrayBookmarks = '';

try {
  storageNumberBookmarks = localStorage.getItem('bookmarks');
  storageArrayBookmarks = JSON.parse(localStorage.getItem('array'));
} catch (err) {
  isStorageSupport = false;
}

if (storageNumberBookmarks || storageArrayBookmarks) {
  numberProductsInBookmark.textContent = storageNumberBookmarks || '';
  if (+numberProductsInBookmark.textContent > 0) {
    linkBookmarks.classList.add('page-header__link-navigation-user--active');
  }

  arrayBookmarks = storageArrayBookmarks || '';
  buttonsСhangeBookmarks.forEach((buttonСhangeBookmarks) => {
    const item = buttonСhangeBookmarks.closest('.products__item');
    if (storageArrayBookmarks.includes(item.id)) {
      buttonСhangeBookmarks.classList.add('products__button-bookmark--active');
    }
  });
}

const changeBookmarks = (button) => {
  const product = button.closest('.products__item');
  const idProduct = product.id;
  let numberBookmarks = + numberProductsInBookmark.textContent;

  if(arrayBookmarks.length === 0) {
    arrayBookmarks.push(idProduct);

    linkBookmarks.classList.add('page-header__link-navigation-user--active');
    button.classList.add('products__button-bookmark--active');
    button.textContent = 'В закладках';
    numberBookmarks += 1;
    numberProductsInBookmark.textContent = numberBookmarks;

    if(isStorageSupport) {
      localStorage.setItem('bookmarks', numberProductsInBookmark.textContent);
      localStorage.setItem('array', JSON.stringify(arrayBookmarks));
    }
  } else {
    if (arrayBookmarks.includes(idProduct)) {
      const idIndex = arrayBookmarks.indexOf(idProduct);
      if (idIndex !== -1) {
        arrayBookmarks.splice(idIndex, 1);
      }

      button.classList.remove('products__button-bookmark--active');
      button.textContent = 'В закладки';
      numberBookmarks -= 1;
      numberProductsInBookmark.textContent = numberBookmarks;

      if(isStorageSupport) {
        localStorage.setItem('bookmarks', numberProductsInBookmark.textContent);
        localStorage.setItem('array', JSON.stringify(arrayBookmarks));
      }

      if(arrayBookmarks.length === 0) {
        linkBookmarks.classList.remove('page-header__link-navigation-user--active');
      }

    } else {
      arrayBookmarks.push(idProduct);
      linkBookmarks.classList.add('page-header__link-navigation-user--active');
      button.classList.add('products__button-bookmark--active');
      button.textContent = 'В закладках';
      numberBookmarks += 1;
      numberProductsInBookmark.textContent = numberBookmarks;

      if(isStorageSupport) {
        localStorage.setItem('bookmarks', numberProductsInBookmark.textContent);
        localStorage.setItem('array', JSON.stringify(arrayBookmarks));
      }
    }
  }
};

//Обработчики
const onButtonСhangeBookmarksClick = (evt) => {
  changeBookmarks(evt.target);
};

buttonsСhangeBookmarks.forEach((buttonСhangeBookmarks) => {
  buttonСhangeBookmarks.disabled = false;
  buttonСhangeBookmarks.addEventListener('click', onButtonСhangeBookmarksClick);
});
