const products = document.querySelectorAll('.products__item');

let objectProducts = {};

let isStorageSupport = true;
let storageArrayProduct = '';

//получить значения из localStorage
try {
  storageArrayProduct = JSON.parse(localStorage.getItem('product'));
} catch (err) {
  isStorageSupport = false;
}

if (storageArrayProduct) {
  objectProducts = storageArrayProduct;
}


if (products) {
  products.forEach((product) => {
    objectProducts[product.id] = {};
    objectProducts[product.id].sourceSrcset = `${product.children[0].children[0].children[0].srcset}`;
    objectProducts[product.id].imgWidth = `${product.children[0].children[0].children[1].width}`;
    objectProducts[product.id].imgHeight = `${product.children[0].children[0].children[1].height}`;
    objectProducts[product.id].imgSrc = `img/${product.id}.png`;
    objectProducts[product.id].imgSrcset = `${product.children[0].children[0].children[1].srcset}`;
    objectProducts[product.id].imgAlt = `${product.children[0].children[0].children[1].alt}`;
    objectProducts[product.id].title = `${product.children[1].children[0].textContent}`;
    objectProducts[product.id].oldPrice = `${product.children[1].children[1].textContent}`;
    objectProducts[product.id].newPrice = `${product.children[1].children[2].textContent}`;
  });

  if(isStorageSupport) {
    localStorage.setItem('product', JSON.stringify(objectProducts));
  }
}

export { objectProducts };
