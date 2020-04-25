import FilmCardComponent from "../components/film-card.js";
import FilmCardFullComponent from "../components/film-card-full.js";
import {render, remove, replace} from "../utils/render.js";
import {ViewMode} from "../const.js";
import {isEscKey} from "../utils/keyboard.js";

export default class FilmController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._viewMode = ViewMode.DEFAULT;

    this._filmCardComponent = null;
    this._filmCardFullComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._showFilmPopup = this._showFilmPopup.bind(this);
    this._hideFilmPopup = this._hideFilmPopup.bind(this);
  }

  render(film) {
    const oldFilmCardComponent = this._filmCardComponent;
    const oldFilmCardFullComponent = this._filmCardFullComponent;

    this._filmCardComponent = new FilmCardComponent(film);
    this._filmCardFullComponent = new FilmCardFullComponent(film);

    this._filmCardComponent.setFilmClickHandler(() => {
      this._showFilmPopup();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._filmCardFullComponent.setCloseButtonHandler(() => {
      this._hideFilmPopup();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
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


    this._filmCardFullComponent.setAddToWatchlistButtonClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isInWatchlist: !film.isInWatchlist,
      }));
    });

    this._filmCardFullComponent.setMarkAsWatchedButtonClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isWatched: !film.isWatched,
      }));
    });

    this._filmCardFullComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isFavorite: !film.isFavorite,
      }));
    });


    if (oldFilmCardComponent && oldFilmCardFullComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._filmCardFullComponent, oldFilmCardFullComponent);
    } else {
      render(this._container, this._filmCardComponent);
    }

  }

  setDefaultView() {
    if (this._viewMode !== ViewMode.DEFAULT) {
      this._hideFilmPopup();
    }
  }

  _showFilmPopup() {
    this._onViewChange();
    this._viewMode = ViewMode.POPUP;
    const bodyElement = document.querySelector(`body`);
    render(bodyElement, this._filmCardFullComponent);
  }

  _hideFilmPopup() {
    this._filmCardFullComponent.reset();
    this._viewMode = ViewMode.DEFAULT;
    remove(this._filmCardFullComponent);
  }

  _onEscKeyDown(evt) {
    if (isEscKey(evt)) {
      this._hideFilmPopup();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
