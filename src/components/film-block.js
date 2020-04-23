import AbstractComponent from "./abstract-component.js";

const createFilmBlockTemplate = () => {
  return (
    `<section class="films"></section>`
  );
};

export default class FilmBlock extends AbstractComponent {
  getTemplate() {
    return createFilmBlockTemplate();
  }
}
