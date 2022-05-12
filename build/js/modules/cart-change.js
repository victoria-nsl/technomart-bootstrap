import { createCardOnPageCart } from './create-cards.js';

const buttonsСhangeCart = document.querySelectorAll('[data-button-buy]');
const linkCart = document.querySelector('[data-cart]');
const numberProductsInCart = linkCart.querySelector('span:last-child');

let changeProductInCart;

if (buttonsСhangeCart) {
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
    if (numberProductsInCart) {
      numberProductsInCart.textContent = storageNumberCart || '';
      if (+numberProductsInCart.textContent > 0) {
        linkCart.classList.add('page-header__link-navigation-user--active');
      }
    }

    arrayCart = storageArrayCart || '';
    buttonsСhangeCart.forEach((buttonСhangeCart) => {
      const item = buttonСhangeCart.closest('[data-product-item]');
      if (storageArrayCart.includes(item.id)) {
        buttonСhangeCart.classList.add('products__button-buy--active');
        buttonСhangeCart.children[1].textContent = 'В корзине';
      }
    });
  }

  const blockCart = document.querySelector('.cart__form-order div:nth-child(1)');

  if (blockCart) {
    arrayCart.forEach((id) => {
      const list = createCardOnPageCart(id);
      blockCart.append(list);
    });
  }

  //установить значения в localStorage
  const setItemsLocalStorage = (array, numberCart) => {
    if (isStorageSupport) {
      localStorage.setItem('cart', numberCart.textContent);
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

    setItemsLocalStorage(arrayCart, numberProductsInCart);
  };


  /*=============УДАЛЕНИЕ ТОВАРА ИЗ КОРЗИНЫ===========*/
  const removeFromCart = (idProduct, button, numberCart) => {
    const idIndex = arrayCart.indexOf(idProduct);
    if (idIndex !== -1) {
      arrayCart.splice(idIndex, 1);
    }

    if (arrayCart.length === 0) {
      linkCart.classList.remove('page-header__link-navigation-user--active');
    }

    button.classList.remove('products__button-buy--active');
    button.children[1].textContent = 'В корзину';
    numberCart -= 1;
    numberProductsInCart.textContent = numberCart;

    setItemsLocalStorage(arrayCart, numberProductsInCart);
  };

  /*=============ИЗМЕНИТЬ КОЛИЧЕСТВО ТОВАРОВ В КОРЗИНЕ===========*/
  changeProductInCart = (buttonSelected) => {
    const productSelected = buttonSelected.closest('[data-product-item]');
    const idProductSelected = productSelected.id;
    const numberCartInitial = + numberProductsInCart.textContent;

    if (arrayCart.length === 0) {
      addToCart(idProductSelected, buttonSelected, numberCartInitial);
      return;
    }

    arrayCart.includes(idProductSelected) ? removeFromCart(idProductSelected, buttonSelected, numberCartInitial) : addToCart(idProductSelected, buttonSelected, numberCartInitial);
  };

  const onButtonСhangCartClick = (evt) => {
    if (evt.target.matches('[data-button-buy]') || evt.target.matches('[data-button-buy] svg') || evt.target.matches('[data-button-buy] span')) {
      changeProductInCart(evt.target.closest('button'));
    }
  };

  buttonsСhangeCart.forEach((buttonСhangeCart) => {
    buttonСhangeCart.disabled = false;
    buttonСhangeCart.addEventListener('click', onButtonСhangCartClick);
  });
}

export { changeProductInCart};
