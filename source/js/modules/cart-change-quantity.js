const blockCards = document.querySelector('.cart');
const linkCart =  document.querySelector('[data-cart]');

if(blockCards) {
  const cardsProduct = blockCards.querySelectorAll('.cart__item');
  const fieldPriceTotal = blockCards.querySelector('#total-price');
  const numberProductsInCart = linkCart.querySelector('span:last-child');

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
    }
    arrayCart = storageArrayCart || '';
  }

  //установить значения в localStorage
  const setItemsLocalStorage = (array, numberCart) => {
    if (isStorageSupport) {
      localStorage.setItem('cart', numberCart.textContent);
      localStorage.setItem('array-cart', JSON.stringify(array));
    }
  };

  //Функция подсчета общей стоимости
  const countPriceTotal = () => {
    let priceTotal = 0;
    cardsProduct.forEach((cardProduct) =>  {
      const quantity = +cardProduct.querySelector('input').value;
      const price = +(cardProduct.querySelector('p:nth-child(3)').textContent).match(/\d/g).join('');
      priceTotal += quantity*price;
    });

    fieldPriceTotal.textContent = `${priceTotal} руб.`;
  };

  countPriceTotal();

  const onCardProductClick = (evt) => {
    if (evt.target.classList.contains('cart__button-quantity')) {
      const productCart = evt.target.closest('.cart__item');
      const  inputQuantityProduct =  productCart.querySelector('input');
      let quantityProduct = +inputQuantityProduct.value;

      if (evt.target.classList.contains('cart__button-quantity--plus')) {
        quantityProduct++;
      } else if (quantityProduct === 1) {
        quantityProduct = 1;
      } else {
        quantityProduct--;
      }

      inputQuantityProduct.value=quantityProduct;

      countPriceTotal();
    }

    if(evt.target.classList.contains('cart__button-delete')) {
      const productCart = evt.target.closest('.cart__item');

      const  inputQuantityProduct = productCart.querySelector('input');
      const quantityProduct = 0;
      inputQuantityProduct.value= quantityProduct;

      let numberCart = + numberProductsInCart.textContent;


      productCart.remove();

      const idIndex = arrayCart.indexOf(productCart.id);
      if (idIndex !== -1) {
        arrayCart.splice(idIndex, 1);
      }

      if (arrayCart.length === 0) {
        linkCart.classList.remove('page-header__link-navigation-user--active');
      }
      numberCart -= 1;
      numberProductsInCart.textContent = numberCart;

      setItemsLocalStorage(arrayCart, numberProductsInCart);

      countPriceTotal();
    }
  };

  const onCardProductChange = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      countPriceTotal();
    }
  };


  cardsProduct. forEach((cardProduct) => {
    cardProduct.addEventListener('click', onCardProductClick);
  });

  cardsProduct. forEach((cardProduct) => {
    cardProduct.addEventListener('change', onCardProductChange);
  });
}
