const buttonsСhangeBookmarks = document.querySelectorAll('.products__button-bookmark');

const listBookmarks =document.createElement('div');
listBookmarks.classList.add('bookmark__list');

if (buttonsСhangeBookmarks) {
  const linkBookmarks = document.querySelector('.page-header__link-navigation-user--bookmark');
  const numberProductsInBookmark = linkBookmarks.querySelector('.page-header__link-navigation-user--bookmark span:last-child');
  let numberBookmarks = + numberProductsInBookmark.textContent;

  //Cоздать карточку товара в списке товаров на странице Закладки
  const createItemInBookmarks = (product, idProduct ) => {
    const itemBookmark =document.createElement('div');
    itemBookmark.classList.add('bookmark__item');
    itemBookmark.setAttribute('id', idProduct);

    const image = document.createElement('img');
    const currentSrc = `img/${idProduct}.png`;
    image.setAttribute('src',currentSrc);
    itemBookmark.append(image);

    const title =document.createElement('h3');
    title.textContent = product.children[1].children[0].textContent;
    itemBookmark.append(title);

    const price =document.createElement('p');
    price.textContent = product.children[1].children[1].textContent;
    itemBookmark.append(price);

    const button =document.createElement('button');
    button.classList.add('bookmark__button');
    button.textContent = 'Купить';
    itemBookmark.append(button);

    listBookmarks.append(itemBookmark);

    return itemBookmark;
  };

  //Удалить карточку товара из списка товаров в разделе Закладки
  const removeItemFromBookmark = (itemBookmark) => {
    itemBookmark.remove();  };

  //Изменить количество карточек на странице закладки
  const changeBookmarks = (button) => {
    const product = button.closest('.products__item');
    const idProduct = product.id;

    const itemsBookmark = listBookmarks.querySelectorAll('.bookmark__item');
    const itemBookmarkCurrentId = Array.from(itemsBookmark).find((item) => item.id === idProduct);

    if (button.classList.contains('products__button-bookmark--active')) {
      button.classList.remove('products__button-bookmark--active');
      button.textContent = 'В закладки';
      numberBookmarks -= 1;
      numberProductsInBookmark.textContent = numberBookmarks;
      removeItemFromBookmark(itemBookmarkCurrentId);

      if(listBookmarks.children.length === 0) {
        linkBookmarks.classList.remove('page-header__link-navigation-user--active');
      }
    } else {
      if (!linkBookmarks.classList.contains('page-header__link-navigation-user--active')) {
        linkBookmarks.classList.add('page-header__link-navigation-user--active');
      }
      button.classList.add('products__button-bookmark--active');
      button.textContent = 'В закладках';
      numberBookmarks += 1;
      numberProductsInBookmark.textContent = numberBookmarks;
      createItemInBookmarks(product, idProduct);
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
}

export {listBookmarks};
