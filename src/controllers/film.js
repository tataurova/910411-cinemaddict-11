import FilmCardComponent from "../components/film-card.js";
import FilmCardFullComponent from "../components/film-card-full.js";
import {render, remove, replace} from "../utils/render.js";
import {FilmCardViewMode as ViewMode, ButtonID} from "../const.js";
import {isEscKey} from "../utils/keyboard.js";

export default class FilmController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._film = null;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = ViewMode.DEFAULT;

    this._filmCardComponent = null;
    this._filmCardFullComponent = null;

    this._emojiName = ``;

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

    this._setFilmCardComponentHandlers();
    this._setFilmCardFullComponentHandlers();

    if (oldFilmCardComponent && oldFilmCardFullComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._filmCardFullComponent, oldFilmCardFullComponent);
    } else {
      render(this._container, this._filmCardComponent);
    }
  }


  getFilm() {
    return this._filmCardComponent.getFilmData();
  }

  setDefaultView() {
    if (this._mode !== ViewMode.DEFAULT) {
      this._hideFilmPopup();
    }
  }

  _setFilmCardComponentHandlers() {
    this._filmCardComponent.setClickHandler(() => {
      this._showFilmPopup();
    });

    this._filmCardComponent.setAddToWatchlistButtonClickHandler(() => {
      this._onDataChange(this, this._film, Object.assign({}, this._film, {
        isInWatchlist: !this._film.isInWatchlist,
      }));
    });

    this._filmCardComponent.setMarkAsWatchedButtonClickHandler(() => {
      this._onDataChange(this, this._film, Object.assign({}, this._film, {
        isWatched: !this._film.isWatched,
      }));
    });

    this._filmCardComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, this._film, Object.assign({}, this._film, {
        isFavorite: !this._film.isFavorite,
      }));
    });
  }

  _setFilmCardFullComponentHandlers() {

    this._filmCardFullComponent.setCloseButtonHandler(() => {
      this._hideFilmPopup();
    });

    this._filmCardFullComponent.setControlButtonsChangeHandler((buttonID) => {
      if (buttonID === ButtonID.WATCHLIST) {
        this._onDataChange(this, this._film, (Object.assign({}, this._film, {
          isInWatchlist: !this._film.isInWatchlist,
        })));
      }
      if (buttonID === ButtonID.WATCHED) {
        this._onDataChange(this, this._film, (Object.assign({}, this._film, {
          isWatched: !this._film.isWatched,
        })));
      }
      if (buttonID === ButtonID.FAVORITE) {
        this._onDataChange(this, this._film, (Object.assign({}, this._film, {
          isFavorite: !this._film.isFavorite,
        })));
      }
    });

  }

  _showFilmPopup() {
    this._onViewChange();
    this._filmCardFullComponent.rerender();

    render(document.body, this._filmCardFullComponent);
    this._mode = ViewMode.POPUP;

    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _hideFilmPopup() {
    this._mode = ViewMode.DEFAULT;
    remove(this._filmCardFullComponent);

    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (isEscKey(evt)) {
      this._hideFilmPopup();
    }
  }
}
