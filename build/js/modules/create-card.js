const listBookmarks =document.createElement('div');
listBookmarks.classList.add('bookmark__list');


const createCardOnPageBookmarks = (idProduct)=> {
  const cardOnPageBookmarks =document.createElement('div');
  cardOnPageBookmarks.classList.add('bookmark__item');
  cardOnPageBookmarks.setAttribute('id', idProduct);


  listBookmarks.append(cardOnPageBookmarks);
  console.log(listBookmarks);
  return listBookmarks;
};


export {createCardOnPageBookmarks, removeCardOnPageBookmarks};
