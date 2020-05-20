import AbstractComponent from "./abstract-component.js";

const createFilmListTemplate = (info) => {
  const {title, isExtra = false, isNoHeader} = info;
  return (
    `<section class="films-list${isExtra ? `--extra` : ``}">
      <h2 class="films-list__title ${isNoHeader === true ? `visually-hidden` : ``}">${title}</h2>
     </section>`
  );
};

export default class FilmList extends AbstractComponent {
  constructor(info) {
    super();
    this._info = info;
  }

  getTemplate() {
    return createFilmListTemplate(this._info);
  }
}
