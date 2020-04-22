import {createElement} from "../utils/render.js";

const createStatsTemplate = (count) => {
  return (
    `<p>${count} movies inside</p>`
  );
};

export default class Stats {
  constructor(count) {
    this._count = count;
    this._element = null;
  }

  getTemplate() {
    return createStatsTemplate(this._count);
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
