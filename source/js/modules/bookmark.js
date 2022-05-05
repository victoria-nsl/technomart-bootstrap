const bookmark = document.querySelector('.page-header__link-navigation-user--bookmark');
const listProducts = document.querySelector('.products__list');

if (bookmark) {
  const numberProductsBookmark = bookmark.querySelector('.page-header__link-navigation-user--bookmark span:last-child');

  const addProductInBookmark = () => {
    let numberBookmarks = + numberProductsBookmark.textContent;

    if(numberBookmarks === 0) {
      bookmark.classList.add('page-header__link-navigation-user--active');
    }
    numberBookmarks += 1;
    numberProductsBookmark.textContent = numberBookmarks;
  };

  const onlistProductsClick = (evt) => {
    if (evt.target.matches('.products__button-bookmark')) {
      addProductInBookmark();
    }
  };

  listProducts.addEventListener('click', onlistProductsClick);
}
