import AbstractSmartComponent from "./abstract-smart-component.js";
import moment from "moment";

const createGenresTemplate = (genres) => {
  return genres.map((genre) => {
    return (
      `<span class="film-details__genre">${genre}</span>`
    );
  }).join(`\n`);
};

const createFilmCardFullTemplate = (film) => {
  const {
    poster,
    title,
    rating,
    durationMinutes,
    genres,
    description,
    director,
    writers,
    actors,
    productionDate,
    country,
    ageRating,
    isInWatchlist,
    isWatched,
    isFavorite,
  } = film;

  const date = moment(productionDate).format(`D MMMM`);
  const year = moment(productionDate).format(`gggg`);
  const durationHours = moment.utc(moment.duration(durationMinutes, `minutes`).asMilliseconds()).format(`H[h] mm[m]`);

  return (
    `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${title}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            ${[
      [`Director`, director],
      [`Writers`, writers],
      [`Actors`, actors],
      [`Release Date`, `${date} ${year}`],
      [`Runtime`, `${durationHours}`],
      [`Country`, country],
      [genres.length === 1 ? `Genre` : `Genres`, createGenresTemplate(genres)]
    ].map(([term, cell]) => (
      `<tr class="film-details__row">
                   <td class="film-details__term">${term}</td>
                   <td class="film-details__cell">${cell}</td>
                </tr>`
    )).join(`\n`)}
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isInWatchlist ? `checked` : ``}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched ? `checked` : ``}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite ? `checked` : ``}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>
  </form>
</section>`
  );
};

export default class FilmCardFull extends AbstractSmartComponent {
  constructor(film) {
    super();
    this._film = film;

    this._closeButtonHandler = null;
    this._setControlButtonsChangeHandler = null;

  }

  getTemplate() {
    return createFilmCardFullTemplate(this._film);
  }

  recoveryListeners() {
    this.setCloseButtonHandler(this._closeButtonHandler);
    this.setControlButtonsChangeHandler(this._setControlButtonsChangeHandler);
  }

  setCloseButtonHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);
    this._closeButtonHandler = handler;
  }

  setControlButtonsChangeHandler(handler) {
    this.getElement().querySelector(`.film-details__controls`).addEventListener(`change`, (evt) => {
      handler(evt.target.id);
    });
    this._setControlButtonsChangeHandler = handler;
  }
}
