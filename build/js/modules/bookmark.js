const bookmark = document.querySelector('.page-header__link-navigation-user--bookmark');
const buttonsBookmark = document.querySelectorAll('.products__button-bookmark');

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

  const onButtonBookmarkClick = () => {
    addProductInBookmark();
  };

  buttonsBookmark.forEach((buttonBookmark) => {
    buttonBookmark.disabled = false;
    buttonBookmark.addEventListener('click', onButtonBookmarkClick);
  });
}
