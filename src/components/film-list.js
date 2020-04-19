import {createElement} from "../utils/render.js";

const createFilmListTemplate = (info) => {
  const {title, isExtra = false, isNoHeader} = info;
  return (
    `<section class="films-list${isExtra ? `--extra` : ``}">
      <h2 class="films-list__title ${isNoHeader ? `visually-hidden` : ``}">${title}</h2>
     </section>`
  );
};

export default class FilmList {
  constructor(info) {
    this._info = info;
    this._element = null;
  }

  getTemplate() {
    return createFilmListTemplate(this._info);
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
