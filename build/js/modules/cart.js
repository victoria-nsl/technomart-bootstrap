const linkCart = document.querySelector('.page-header__link-navigation-user--cart');
const numberProductsInCart = linkCart.querySelector('.page-header__link-navigation-user--cart span:last-child');

const  buttonsСhangeCart = document.querySelectorAll('.products__button-buy');

let arrayCart = [];

/*=============LOCALSTORAGE===========*/
let isStorageSupport = true;
let storageNumberCart = '';
let storageArrayCart = '';

//получить значения из localStorage
try {
  storageNumberCart = localStorage.getItem('cart');
  storageArrayCart = JSON.parse(localStorage.getItem('array-cart'));
} catch (err) {
  isStorageSupport = false;
}

if (storageNumberCart || storageArrayCart) {
  numberProductsInCart.textContent = storageNumberCart || '';
  if (+numberProductsInCart.textContent > 0) {
    linkCart.classList.add('page-header__link-navigation-user--active');
  }

  arrayCart = storageArrayCart || '';
  buttonsСhangeCart.forEach((buttonСhangeCart) => {
    const item = buttonСhangeCart.closest('.products__item');
    if (storageArrayCart.includes(item.id)) {
      buttonСhangeCart.classList.add('products__button-buy--active');
      buttonСhangeCart.children[1].textContent = 'В корзине';
    }
  });
}

//установить значения в localStorage
const  setItemsLocalStorage  = (array, numberBookmark) => {
  if(isStorageSupport) {
    localStorage.setItem('cart', numberBookmark.textContent);
    localStorage.setItem('array-cart', JSON.stringify(array));
  }
};

/*=============ДОБАВЛЕНИЕ ТОВАРА В КОРЗИНУ===========*/
const addToCart = (idProduct, button, numberCart) => {
  arrayCart.push(idProduct);

  linkCart.classList.add('page-header__link-navigation-user--active');

  button.classList.add('products__button-buy--active');
  button.children[1].textContent = 'В корзине';
  numberCart += 1;
  numberProductsInCart.textContent = numberCart;

  setItemsLocalStorage (arrayCart, numberProductsInCart);
};


/*=============УДАЛЕНИЕ ТОВАРА ИЗ КОРЗИНЫ===========*/
const removeFromCart = (idProduct, button, numberCart) => {
  const idIndex = arrayCart.indexOf(idProduct);
  if (idIndex !== -1) {
    arrayCart.splice(idIndex, 1);
  }

  if(arrayCart.length === 0) {
    linkCart.classList.remove('page-header__link-navigation-user--active');
  }

  button.classList.remove('products__button-buy--active');
  button.children[1].textContent = 'Купить';
  numberCart -= 1;
  numberProductsInCart.textContent = numberCart;

  setItemsLocalStorage (arrayCart, numberProductsInCart);
};

/*=============ИЗМЕНИТЬ КОЛИЧЕСТВО ТОВАРОВ В КОРЗИНЕ===========*/
const changeProductInCart = (buttonSelected) => {
  const productSelected = buttonSelected.closest('.products__item');
  const idProductSelected = productSelected.id;
  const  numberCartInitial= + numberProductsInCart.textContent;

  if(arrayCart.length === 0) {
    addToCart(idProductSelected, buttonSelected, numberCartInitial);
    return;
  }

  arrayCart.includes(idProductSelected) ?  removeFromCart(idProductSelected, buttonSelected, numberCartInitial) : addToCart(idProductSelected, buttonSelected, numberCartInitial );
};

export {changeProductInCart};
