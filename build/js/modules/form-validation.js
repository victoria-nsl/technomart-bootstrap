import {closePopup} from './popup.js';
const form = document.querySelector('.popup-lost__form');

if(form) {
  const popupLost = document.querySelector('.popup-lost');
  const fieldsRequired = form.querySelectorAll('[data-required]');
  const inputName = form.querySelector('#user-name');
  const inputEmail = form.querySelector('#user-email');
  const textareaLetter = form.querySelector('#letter-text');

  /*=============LOCALSTORAGE===========*/
  let isStorageSupport = true;
  let storageName = '';
  let storageEmail = '';

  try {
    storageName = localStorage.getItem('name');
    storageEmail = localStorage.getItem('email');

  } catch (err) {
    isStorageSupport = false;
  }

  if (storageName  || storageEmail) {
    inputName.value = storageName;
    inputEmail.value = storageEmail;
  }

  /*=============ОТПРАВКА ФОРМЫ===========*/
  //Изначально удаляем атрибут required, чтобы при отправке формы у поля появлялась красная рамка, если оно не заполнено.
  fieldsRequired.forEach((fieldRequired) => fieldRequired.required = false);

  //Валидация при отправке формы
  const onFormSubmit = (evt)  => {
    if(!inputName.value || !inputEmail.value || !textareaLetter.value) {
      evt.preventDefault();
      fieldsRequired.forEach((fieldRequired) => {
        if(!fieldRequired.value) {
          fieldRequired.classList.add('popup-lost__field-error');
        }
      });
    } else {
      if(isStorageSupport) {
        localStorage.setItem('name', inputName.value);
        localStorage.setItem('email',  inputEmail.value);
      }
      closePopup(popupLost);
    }
  };

  //Удаление класса ошибки при заполнении поля(удаление красной рамки) и снятии фокуса с поля
  const onFieldsRequired =(evt) => {
    if(evt.target.value && evt.target.classList.contains('popup-lost__field-error')) {
      evt.target.classList.remove('popup-lost__field-error');
    }
  };

  //Обработчики
  fieldsRequired.forEach((fieldRequired) => {
    fieldRequired.addEventListener('blur', onFieldsRequired);
  });
  form.addEventListener('submit', onFormSubmit);
}
