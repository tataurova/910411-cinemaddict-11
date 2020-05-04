export const activateElement = (activeClickElement, container, activeClass) => {
  const activeElement = container.querySelector(`.${activeClass}`);

  if (activeElement) {
    activeElement.classList.remove(activeClass);
    activeClickElement.classList.add(activeClass);
  }
};
