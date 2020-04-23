import AbstractComponent from "./abstract-component.js";

const createFilmListContainerTemplate = () => {
  return (
    `<div class="films-list__container"></div>`
  );
};

export default class FilmListContainer extends AbstractComponent {
  constructor(info) {
    super();
    this._info = info;
  }

  getTemplate() {
    return createFilmListContainerTemplate(this._info);
  }
}
