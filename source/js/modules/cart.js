const listCart =document.createElement('div');
listCart.classList.add('cart__list');


const linkCart = document.querySelector('.page-header__link-navigation-user--cart');
const numberProductsInCart = linkCart.querySelector('.page-header__link-navigation-user--cart span:last-child');
let numberCart = + numberProductsInCart.textContent;

//Cоздать карточку товара в списке товаров на странице Корзина
const createItemInCarts = (product, idProduct ) => {
  const itemCart =document.createElement('div');
  itemCart.classList.add('cart__item');
  itemCart.setAttribute('id', idProduct);

  const image = document.createElement('img');
  const currentSrc = `img/${idProduct}.png`;
  image.setAttribute('src',currentSrc);
  itemCart.append(image);

  const title =document.createElement('h3');
  title.textContent = product.children[1].children[0].textContent;
  itemCart.append(title);

  const price =document.createElement('p');
  price.textContent = product.children[1].children[1].textContent;
  itemCart.append(price);

  const button =document.createElement('button');
  button.classList.add('cart__button');
  button.textContent = 'Оформить заказ';
  itemCart.append(button);

  listCart.append(itemCart);

  return itemCart;
};

//Удалить карточку товара из списка товаров в странице Корзина
const removeItemFromCart = (itemCart) => {
  itemCart.remove();
};

//Изменить количество карточек на странице Корзина
const changeProductInCart = (button) => {
  const product = button.closest('.products__item');
  const idProduct = product.id;

  const itemsCart = listCart.querySelectorAll('.cart__item');
  const itemCartCurrentId = Array.from(itemsCart).find((item) => item.id === idProduct);

  if (button.classList.contains('products__button-buy--active')) {
    button.classList.remove('products__button-buy--active');
    button.children[1].textContent = 'Купить';
    numberCart -= 1;
    numberProductsInCart.textContent = numberCart;
    removeItemFromCart(itemCartCurrentId);

    if(listCart.children.length === 0) {
      linkCart.classList.remove('page-header__link-navigation-user--active');
    }
  } else {
    if (!linkCart.classList.contains('page-header__link-navigation-user--active')) {
      linkCart.classList.add('page-header__link-navigation-user--active');
    }
    button.classList.add('products__button-buy--active');
    button.children[1].textContent = 'В корзине';
    numberCart += 1;
    numberProductsInCart.textContent = numberCart;
    createItemInCarts(product, idProduct);
  }
};


export {changeProductInCart};
