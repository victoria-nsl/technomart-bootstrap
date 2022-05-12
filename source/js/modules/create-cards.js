import { objectProducts } from './object-product.js';

const listBookmarks = document.createElement('div');
listBookmarks.classList.add('bookmark__list');
listBookmarks.classList.add('row');
listBookmarks.classList.add('justify-content-center');
listBookmarks.classList.add('align-items-center');

const listCart = document.createElement('div');
listCart.classList.add('cart__list');
listCart.classList.add('row');
listCart.classList.add('justify-content-center');
listCart.classList.add('align-items-center');

//Карточки в закладках
const createCardOnPageBookmarks = (idProduct) => {
  const cardOnPageBookmarks = document.createElement('div');
  cardOnPageBookmarks.classList.add('bookmark__item');
  cardOnPageBookmarks.setAttribute('id', idProduct);
  cardOnPageBookmarks.setAttribute('data-product-item', '');

  cardOnPageBookmarks.innerHTML = `
    <div
      class= "bookmark__wrapper-image">
      <picture>
        <source
          type="image/webp"
          srcset= "${objectProducts[idProduct].sourceSrcset}">

        <img
          class="img-fluid"
          width="${objectProducts[idProduct].imgWidth}"
          height="${objectProducts[idProduct].imgHeight}"
          src="${objectProducts[idProduct].imgSrc}"
          srcset="${objectProducts[idProduct].imgSrcset}"
          alt="${objectProducts[idProduct].imgAlt}">
      </picture>
    </div>

    <div class="bookmark__description">
      <h3>${objectProducts[idProduct].title}</h3>
      <p>${objectProducts[idProduct].oldPrice}</p>
      <p>${objectProducts[idProduct].newPrice}</p>

      <button
        class="bookmark__button-buy"
        type="button"
        data-button-buy>
        <svg
          role="img"
          width="18"
          height="16">
          <use
            xlink:href="img/sprite_auto.svg#icon-header-cart">
          </use>
        </svg>
        <span>
          В корзину
        </span>
      </button>
    </div>`;

  const wrapperItem = document.createElement('div');
  wrapperItem.classList.add('col-xl-3');
  wrapperItem.classList.add('col-md-4');
  wrapperItem.classList.add('col-sm-6');
  wrapperItem.append(cardOnPageBookmarks);

  listBookmarks.append(wrapperItem);

  return listBookmarks;
};

//Карточки в корзине
const createCardOnPageCart = (idProduct) => {
  const cardOnPageCart = document.createElement('div');
  cardOnPageCart.classList.add('cart__item');
  cardOnPageCart.setAttribute('id', idProduct);

  cardOnPageCart.innerHTML = `
    <div
      class= "cart__wrapper-image">
      <picture>
        <source
          type="image/webp"
          srcset= "${objectProducts[idProduct].sourceSrcset}" >

        <img
          class="img-fluid"
          width="${objectProducts[idProduct].imgWidth}"
          height="${objectProducts[idProduct].imgHeight}"
          src="${objectProducts[idProduct].imgSrc}"
          srcset="${objectProducts[idProduct].imgSrcset}"
          alt="${objectProducts[idProduct].imgAlt}">
      </picture>
    </div>

    <div class="cart__description">
      <h3>${objectProducts[idProduct].title}</h3>
      <p>${objectProducts[idProduct].oldPrice}</p>
      <p>${objectProducts[idProduct].newPrice}</p>

      <div class="cart__quantity">
        <button
          class="cart__button-quantity cart__button-quantity--minus"
          type="button"
          aria-label="Убрать товар из корзины">
          -
        </button>
        <label
          class="visually-hidden"
          for="quantity-${idProduct}">
          Количество товара
        </label>
        <input
          id="quantity-${idProduct}"
          type="text"
          name="quantity-${idProduct}"
          value="1"
          data-price="${objectProducts[idProduct].newPrice}">
        <button
          class="cart__button-quantity cart__button-quantity--plus"
          type="button"
          aria-label="Добавить товар в корзину">
          +
        </button>
      </div>
      <button
        class="cart__button-delete"
        type="button">
        Удалить
      </button>
    </div>`;

  const wrapperItem = document.createElement('div');
  wrapperItem.classList.add('col-xl-3');
  wrapperItem.classList.add('col-md-4');
  wrapperItem.classList.add('col-sm-6');
  wrapperItem.append(cardOnPageCart);

  listCart.append(wrapperItem);

  return listCart;
};

export { createCardOnPageBookmarks, createCardOnPageCart };
