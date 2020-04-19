import {createElement} from "../utils/render.js";

const createFilmListContainerTemplate = () => {
  return (
    `<div class="films-list__container"></div>`
  );
};

export default class FilmListContainer {
  constructor(info) {
    this._info = info;
    this._element = null;
  }

  getTemplate() {
    return createFilmListContainerTemplate(this._info);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
