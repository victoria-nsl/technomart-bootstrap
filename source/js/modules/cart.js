const addProductInCart = () => {
  const cart = document.querySelector('.page-header__link-navigation-user--cart');
  const numberProductsCart = cart.querySelector('.page-header__link-navigation-user--cart span:last-child');

  let numberProducts = + numberProductsCart.textContent;

  if(numberProducts === 0) {
    cart.classList.add('page-header__link-navigation-user--active');
  }
  numberProducts += 1;
  numberProductsCart.textContent = numberProducts;
};

export {addProductInCart};
