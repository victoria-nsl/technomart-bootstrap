const WIDTH_DESKTOP = 1199;

const page = document.body;
const blockAccordion = document.querySelector('.filter');

if(blockAccordion && page.clientWidth < WIDTH_DESKTOP) {
  const itemAccordion = blockAccordion.querySelector('.filter__form');
  const trigger = blockAccordion.querySelector('.filter__button');
  const icon = blockAccordion.querySelector('.filter__icon');

  trigger.disabled = false;

  const onTriggerClick = () => {
    itemAccordion.classList.toggle('filter__form--active');
    icon.classList.toggle('filter__icon--opened');
  };

  trigger.addEventListener('click', onTriggerClick);
}
