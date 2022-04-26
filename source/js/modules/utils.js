const KEY_ESCAPE= 'Escape';
const KEY_ESC = 'Esc';

const setFocusTab = (evt, firstElement, lastElement) => {

  const isShiftPressed = evt.shiftKey;
  const isTabPressed = (evt.key === 'Tab');
  if (!isTabPressed) {
    return;
  }

  if (isShiftPressed && isTabPressed && document.activeElement === firstElement) {
    evt.preventDefault();
    lastElement.focus();
  }

  if (!isShiftPressed && isTabPressed && document.activeElement === lastElement) {
    evt.preventDefault();
    firstElement.focus();
  }
};

const isEscEvent = (evt) =>  evt.key ===  KEY_ESCAPE || evt.key === KEY_ESC;

export {setFocusTab, isEscEvent};
