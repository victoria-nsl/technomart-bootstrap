import { objectProducts } from './object-product.js';

const listBookmarks = document.createElement('div');
listBookmarks.classList.add('bookmark__list');
listBookmarks.classList.add('row');

const createCardOnPageBookmarks = (idProduct) => {
  const cardOnPageBookmarks = document.createElement('div');
  cardOnPageBookmarks.classList.add('bookmark__item');
  cardOnPageBookmarks.setAttribute('id', idProduct);

  cardOnPageBookmarks.innerHTML = `

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

    <h3>${objectProducts[idProduct].title}</h3>
    <p>${objectProducts[idProduct].oldPrice}</p>
    <p>${objectProducts[idProduct].newPrice}</p>

    <button type="button">
      <svg role="img" width="18" height="16">
        <use xlink:href="img/sprite_auto.svg#icon-header-cart"></use>
      </svg>
      <span>Купить</span>
    </button>`;

  const wrapperItem = document.createElement('div');
  wrapperItem.classList.add('col-xl-3');
  wrapperItem.classList.add('col-md-4');
  wrapperItem.classList.add('col-sm-6');
  wrapperItem.append(cardOnPageBookmarks);

  listBookmarks.append(wrapperItem);

  return listBookmarks;
};

export { createCardOnPageBookmarks };
