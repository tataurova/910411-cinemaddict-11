import {MAX_LENGTH_SHOWING_TEXT} from "../const.js";
import AbstractComponent from "./abstract-component.js";
import {formatDuration} from "../utils/common.js";
import moment from "moment";

const createButtonMarkup = (name, text, isPressed) => {
  return (
    `<button class="film-card__controls-item button film-card__controls-item--${name}
     ${
    isPressed ? `film-card__controls-item--active`
      : ``
    }
      ">${text}</button>`
  );
};

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
    durationMinutes,
    genres,
    description,
    comments,
    productionDate,
    isInWatchlist,
    isWatched,
    isFavorite,
  } = film;

  const year = moment(productionDate).format(`gggg`);
  const durationHours = formatDuration(durationMinutes);
  const addToWatchListButton = createButtonMarkup(`add-to-watchlist`, `Add to watchlist`, isInWatchlist);
  const markAsWatchedButton = createButtonMarkup(`mark-as-watched`, `Mark as watched`, isWatched);
  const addToFavoriteButton = createButtonMarkup(`favorite`, `Mark as favorite`, isFavorite);
  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${durationHours}</span>
        <span class="film-card__genre">${genres.join(` `)}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">
        ${truncateDescription(description)}
      </p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        ${addToWatchListButton}
        ${markAsWatchedButton}
        ${addToFavoriteButton}
      </form>
    </article>`
  );
};

export default class FilmCard extends AbstractComponent {
  constructor(film) {
    super();
    this._film = film;
    this._element = this.getElement();
  }

  getFilmData() {
    return this._film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  setClickHandler(handler) {
    this._element.querySelector(`.film-card__poster`).addEventListener(`click`, handler);
    this._element.querySelector(`.film-card__title`).addEventListener(`click`, handler);
    this._element.querySelector(`.film-card__comments`).addEventListener(`click`, handler);
  }

  setAddToWatchlistButtonClickHandler(handler) {
    this._element.querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, handler);
  }

  setMarkAsWatchedButtonClickHandler(handler) {
    this._element.querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, handler);
  }

  setFavoriteButtonClickHandler(handler) {
    this._element.querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, handler);
  }
}
