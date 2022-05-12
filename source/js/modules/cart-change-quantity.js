const cardsProduct = document.querySelectorAll('.cart__item');

if(cardsProduct) {
  const fieldPriceTotal = document.querySelector('#total-price');

  const countPriceTotal = () => {
    let priceTotal = 0;
    cardsProduct.forEach((cardProduct) =>  {
      const quantity = +cardProduct.querySelector('input').value;
      const price = +(cardProduct.querySelector('p:nth-child(4)').textContent).match(/\d/g).join('');
      priceTotal += quantity*price;
    });
    fieldPriceTotal.textContent = `${priceTotal} руб.`;
  };

  countPriceTotal();

  const onCardProductClick = (evt) => {
    if (evt.target.classList.contains('cart__button-quantity')) {
      const product = evt.target.closest('.cart__item');
      const  inputQuantityProduct = product.querySelector('input');
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
      const product = evt.target.closest('.cart__item');
      const  inputQuantityProduct = product.querySelector('input');
      inputQuantityProduct.value= 0;

      product.remove();
      countPriceTotal();
    }
  };

  cardsProduct. forEach((cardProduct) => {
    cardProduct.addEventListener('click', onCardProductClick);
  });
}
