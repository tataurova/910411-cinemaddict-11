import FilmCardComponent from "../components/film-card.js";
import FilmCardFullComponent from "../components/film-card-full.js";
import {render, remove, replace} from "../utils/render.js";
import {FilmCardViewMode} from "../const.js";
import {isEscKey} from "../utils/keyboard.js";

const bodyElement = document.querySelector(`body`);

export default class FilmController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._film = null;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._filmCardViewMode = FilmCardViewMode.DEFAULT;

    this._filmCardComponent = null;
    this._filmCardFullComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._showFilmPopup = this._showFilmPopup.bind(this);
    this._hideFilmPopup = this._hideFilmPopup.bind(this);
  }

  render(film) {
    this._film = film;
    const oldFilmCardComponent = this._filmCardComponent;
    const oldFilmCardFullComponent = this._filmCardFullComponent;

    this._filmCardComponent = new FilmCardComponent(film);
    this._filmCardFullComponent = new FilmCardFullComponent(film);

    this._filmCardComponent.setFilmClickHandler(() => {
      this._showFilmPopup();
    });

    this._filmCardFullComponent.setCloseButtonHandler(() => {
      this._hideFilmPopup();
    });


    this._filmCardComponent.setAddToWatchlistButtonClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isInWatchlist: !film.isInWatchlist,
      }));
    });

    this._filmCardComponent.setMarkAsWatchedButtonClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isWatched: !film.isWatched,
      }));
    });

    this._filmCardComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isFavorite: !film.isFavorite,
      }));
    });

    this._filmCardFullComponent.setControlButtonsChangeHandler((newFilm) => {
      this._onDataChange(this, film, newFilm);
    });

    if (oldFilmCardComponent && oldFilmCardFullComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._filmCardFullComponent, oldFilmCardFullComponent);
    } else {
      render(this._container, this._filmCardComponent);
    }

  }

  setDefaultView() {
    if (this._filmCardViewMode !== FilmCardViewMode.DEFAULT) {
      this._hideFilmPopup();
    }
  }

  _showFilmPopup() {
    this._onViewChange();
    this._filmCardViewMode = FilmCardViewMode.POPUP;
    render(bodyElement, this._filmCardFullComponent);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _hideFilmPopup() {
    this._filmCardViewMode = FilmCardViewMode.DEFAULT;
    remove(this._filmCardFullComponent);
    this.render(this._film);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (isEscKey(evt)) {
      this._hideFilmPopup();
    }
  }

  getFilm() {
    return this._filmCardComponent.getFilmData();
  }
}
