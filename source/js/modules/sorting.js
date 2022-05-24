const blockSorting = document.querySelector('.sorting');
const listProducts = document.querySelector('.products__list');

if(blockSorting && listProducts) {
  const listButtonsSorting = blockSorting.querySelector('.sorting__list');
  const buttons = listButtonsSorting.querySelectorAll('.sorting__button');

  const buttonSortingType = listButtonsSorting.querySelector('.sorting__button--type');
  const buttonSortingFunctionality = listButtonsSorting.querySelector('.sorting__button--functionality');
  const buttonSortingPrice = listButtonsSorting.querySelector('.sorting__button--price');
  const iconPrice = buttonSortingPrice.querySelector('.sorting__price-icons');

  const products = listProducts.querySelectorAll('.products__item');

  let listSorted;

  buttons.forEach((button) => {
    button.disabled = false;
  });

  const showActiveButton = (buttonActive) => {
    buttons.forEach((button) => {
      button.classList.remove('sorting__button--active');
    });
    buttonActive.classList.add('sorting__button--active');
  };

  const showSortedList = (list) => {
    listProducts.innerHTML='';

    list.forEach((item)=> {
      const wrapperItem = document.createElement('div');
      wrapperItem.classList.add('col-md-4');
      wrapperItem.classList.add('col-sm-6');
      wrapperItem.append(item);

      listProducts.append(wrapperItem);
    });
  };

  const onButtonSortingPrice = (evt) => {
    showActiveButton(evt.target);

    if(iconPrice.classList.contains('sorting__price-icons--down') || !iconPrice.classList.contains('sorting__price-icons--down') && !iconPrice.classList.contains('sorting__price-icons--up')) {
      listSorted = Array.from(products).sort((a, b) => {
        const firstItem = Number(a.querySelector('.products__item-button').textContent.replace(/\D/g, ''));
        const secondItem = Number(b.querySelector('.products__item-button').textContent.replace(/\D/g, ''));
        return firstItem - secondItem;
      });

      if(iconPrice.classList.contains('sorting__price-icons--down')) {
        iconPrice.classList.remove('sorting__price-icons--down');
      }

      iconPrice.classList.add('sorting__price-icons--up');
    } else {
      listSorted = Array.from(products).sort((a, b) => {
        const firstItem = Number(a.querySelector('.products__item-button').textContent.replace(/\D/g, ''));
        const secondItem = Number(b.querySelector('.products__item-button').textContent.replace(/\D/g, ''));
        return secondItem-firstItem;
      });

      iconPrice.classList.remove('sorting__price-icons--up');
      iconPrice.classList.add('sorting__price-icons--down');
    }
    showSortedList(listSorted);
  };

  const onButtonSortingType = (evt) => {
    showActiveButton(evt.target);

    if(iconPrice.classList.contains('sorting__price-icons--up')) {
      iconPrice.classList.remove('sorting__price-icons--up');
    }

    if(iconPrice.classList.contains('sorting__price-icons--down')) {
      iconPrice.classList.remove('sorting__price-icons--down');
    }

    listSorted = Array.from(products).sort((a, b) => {
      const firstItem = Number(a.querySelector('.products__description h3').textContent.replace(/\D/g, ''));
      const secondItem =Number(b.querySelector('.products__description h3').textContent.replace(/\D/g, ''));
      return firstItem - secondItem;
    });

    showSortedList(listSorted);
  };

  const onButtonSortingFunctionality = (evt) => {
    showActiveButton(evt.target);

    if(iconPrice.classList.contains('sorting__price-icons--up')) {
      iconPrice.classList.remove('sorting__price-icons--up');
    }

    if(iconPrice.classList.contains('sorting__price-icons--down')) {
      iconPrice.classList.remove('sorting__price-icons--down');
    }

    listSorted = Array.from(products).sort((a, b) => {
      const firstItem = Number(a.getAttribute('id').replace(/\D/g, ''));
      const secondItem =Number(b.getAttribute('id').replace(/\D/g, ''));
      return firstItem - secondItem;
    });
    showSortedList(listSorted);
  };

  buttonSortingPrice.addEventListener('click', onButtonSortingPrice);
  buttonSortingType.addEventListener('click', onButtonSortingType);
  buttonSortingFunctionality.addEventListener('click', onButtonSortingFunctionality);
}
