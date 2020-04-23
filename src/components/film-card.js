import {MAX_LENGTH_SHOWING_TEXT} from "../const.js";
import AbstractComponent from "./abstract-component.js";

const truncateDescription = (description, maxLength = MAX_LENGTH_SHOWING_TEXT) => {
  return description.length > maxLength
    ? `${description.slice(0, maxLength - 1)}...`
    : description;
};

const createFilmCardTemplate = (film) => {
  const {
    poster,
    title,
    rating,
    durationHours,
    durationMinutes,
    genres,
    description,
    comments,
    productionDate,
  } = film;

  const year = productionDate.getFullYear();
  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${durationHours}h ${durationMinutes}m</span>
        <span class="film-card__genre">${genres.join(` `)}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">
        ${truncateDescription(description)}
      </p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class FilmCard extends AbstractComponent {
  constructor(film) {
    super();
    this._film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  setFilmClickHandler(handler) {
    const element = this.getElement();
    element.querySelector(`.film-card__poster`).addEventListener(`click`, handler);
    element.querySelector(`.film-card__title`).addEventListener(`click`, handler);
    element.querySelector(`.film-card__comments`).addEventListener(`click`, handler);
  }
}