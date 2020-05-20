import {SHAKE_ANIMATION_TIMEOUT} from "../const.js";

export const activateElement = (activeClickElement, container, activeClass) => {
  const activeElement = container.querySelector(`.${activeClass}`);

  if (activeElement) {
    activeElement.classList.remove(activeClass);
    activeClickElement.classList.add(activeClass);
  }
};

export const shake = (element) => {
  element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

  setTimeout(() => {
    element.style.animation = ``;
  }, SHAKE_ANIMATION_TIMEOUT);
};
