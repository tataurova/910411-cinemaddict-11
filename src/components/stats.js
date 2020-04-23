import AbstractComponent from "./abstract-component.js";

const createStatsTemplate = (count) => {
  return (
    `<p>${count} movies inside</p>`
  );
};

export default class Stats extends AbstractComponent {
  constructor(count) {
    super();
    this._count = count;
  }

  getTemplate() {
    return createStatsTemplate(this._count);
  }
}
