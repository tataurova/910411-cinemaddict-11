import AbstractComponent from "./abstract-component.js";
import {activateElement} from "../utils/interactivity";

const createSiteMenuTemplate = () => {
  return (
    `<nav class="main-navigation">
      <a href="#stats" id="stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class SiteMenu extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  menuClickHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName !== `A`) {
        return;
      }
      const menuItem = evt.target.id;
      activateElement(evt.target, this.getElement(), `main-navigation__item--active`);
      handler(menuItem);
    });
  }
}
