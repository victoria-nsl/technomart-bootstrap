const WIDTH_DESKTOP = 1199;

const page = document.body;
const blockAccordion = document.querySelector('.filter');

if(blockAccordion) {
  const itemAccordion = blockAccordion.querySelector('.filter__form');
  const trigger = blockAccordion.querySelector('.filter__button');
  const icon = blockAccordion.querySelector('.filter__icon');

  itemAccordion.classList.remove('filter__form--nojs');

  if(page.clientWidth < WIDTH_DESKTOP) {
    trigger.disabled = false;
    icon.classList.remove('filter__icon--nojs');

    const onTriggerClick = () => {
      itemAccordion.classList.toggle('filter__form--active');
      icon.classList.toggle('filter__icon--opened');
    };

    trigger.addEventListener('click', onTriggerClick);
  }
}
