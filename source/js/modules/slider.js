const slider = document.getElementById('slider');
const fieldsValue = document.querySelectorAll('.slider-block__value');


window.noUiSlider.create(slider, {
  start: [0, 30000],
  connect: [false, true, false],
  range: {
    'min': 0,
    'max': 35000,
  },
  step: 100,
  //tooltips: true,
  //margin: 10,
});


const onSliderUpdate = (evt) =>  {
  fieldsValue[0].value = Math.round(evt[0]);
  fieldsValue[1].value = Math.round(evt[1]);
};

const onfieldValueInput = (evt) => {
  if (evt.target === fieldsValue[0]) {
    slider.noUiSlider.set([evt.target.value, null]);
  }
  if (evt.target === fieldsValue[1]) {
    slider.noUiSlider.set([null, evt.target.value]);
  }
};

slider.noUiSlider.on('update', onSliderUpdate);
fieldsValue.forEach((fieldValue) => fieldValue.addEventListener('input', onfieldValueInput));
