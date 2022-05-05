import './modules/utils.js';
import './modules/navigation.js';
import './modules/tab.js';
import './modules/popup.js';
import './modules/bookmark.js';
import './modules/cart.js';
import './modules/form-validation.js';

//Карусель (сделана с помощью библиотеки bootstrap). Кнопки не видны при неработающем
const buttonsPrevCarousel = document.querySelector('.about .carousel-control-prev');
const buttonsNextCarousel = document.querySelector('.about .carousel-control-next');


buttonsPrevCarousel.disabled = false;
buttonsNextCarousel.disabled = false;
