import AbstractComponent from "./abstract-component.js";

const createFilmListContainerTemplate = () => {
  return (
    `<div class="films-list__container"></div>`
  );
};

export default class FilmListContainer extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createFilmListContainerTemplate();
  }
}

