const listBookmarks =document.createElement('div');
listBookmarks.classList.add('bookmark__list');

const listProduct = document.querySelectorAll('.products__item');
const arrayCardsProducts = Array.from(listProduct);


const createCardOnPageBookmarks = (idProduct)=> {
  const product = arrayCardsProducts.find((itemProduct) => itemProduct.id === idProduct);

  const cardOnPageBookmarks =document.createElement('div');
  cardOnPageBookmarks.classList.add('bookmark__item');
  cardOnPageBookmarks.setAttribute('id', idProduct);

  cardOnPageBookmarks.innerHTML = `
  <div class="bookmark__wrapper-image">
    <picture>
      <source
        type="image/webp"
        srcset="${product.children[0].children[0].children[0].srcset}">

      <img
        class="img-fluid"
        width="${product.children[0].children[0].children[1].width}"
        height="${product.children[0].children[0].children[1].height}"
        src="img/${idProduct}.png"
        srcset="${product.children[0].children[0].children[1].srcset}"
        alt="${product.children[0].children[0].children[1].alt}">
    </picture>
  </div>
  <div class="bookmark__description">
    <h3>${product.children[1].children[0].textContent}</h3>
    <p>${product.children[1].children[1].textContent}</p>
    <div class="bookmark__item-button">${product.children[1].children[2].textContent}</div>
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

const removeCardOnPageBookmarks = (idProduct)=> {


  const arrayCardsBookmarks = Array.from(listBookmarks.children);

  arrayCardsBookmarks.forEach((cardBookmarks) => {
    if (cardBookmarks.children[0].id === idProduct) {
      cardBookmarks.remove();
    }
  });

  return listBookmarks;
};


export {createCardOnPageBookmarks, removeCardOnPageBookmarks};
