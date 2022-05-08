import { objectProducts } from './object-product.js';

const listBookmarks =document.createElement('div');
listBookmarks.classList.add('bookmark__list');

const createCardOnPageBookmarks = (idProduct)=> {
  const cardOnPageBookmarks =document.createElement('div');
  cardOnPageBookmarks.classList.add('bookmark__item');
  cardOnPageBookmarks.setAttribute('id', idProduct);

  cardOnPageBookmarks.innerHTML = `
  <div class="bookmark__wrapper-image">
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
  <div class="bookmark__description">
    <h3>${objectProducts[idProduct].title }</h3>
    <p>${objectProducts[idProduct].oldPrice}</p>
    <div class="bookmark__item-button">${objectProducts[idProduct].newPrice}</div>
  </div>
  <div class="bookmark__wrapper-button">
    <button class="bookmark__button-buy" type="button">
      <svg role="img" width="18" height="16">
        <use xlink:href="img/sprite_auto.svg#icon-header-cart"></use>
      </svg>
      <span>Купить</span>
    </button>
  </div>`;

  const wrapperCardOnPageBookmarks =document.createElement('div');
  wrapperCardOnPageBookmarks.classList.add('col-xl-3');
  wrapperCardOnPageBookmarks.classList.add('col-md-4');
  wrapperCardOnPageBookmarks.classList.add('col-sm-6');
  wrapperCardOnPageBookmarks.append(cardOnPageBookmarks);

  listBookmarks.append(wrapperCardOnPageBookmarks);

  return listBookmarks;
};

export { createCardOnPageBookmarks };
