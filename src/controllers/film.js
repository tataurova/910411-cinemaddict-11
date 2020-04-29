import FilmCardComponent from "../components/film-card.js";
import FilmCardFullComponent from "../components/film-card-full.js";
import {render, remove, replace} from "../utils/render.js";
import {FilmCardViewMode as ViewMode, ButtonID} from "../const.js";
import {isEscKey} from "../utils/keyboard.js";
import CommentsComponent from "../components/comments";

export default class FilmController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._film = null;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = ViewMode.DEFAULT;

    this._filmCardComponent = null;
    this._filmCardFullComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._showFilmPopup = this._showFilmPopup.bind(this);
    this._hideFilmPopup = this._hideFilmPopup.bind(this);

    this._emojiName = ``;

    this._commentsComponent = null;
    this._comments = null;
  }

  render(film) {
    this._film = film;

    const oldFilmCardComponent = this._filmCardComponent;
    const oldFilmCardFullComponent = this._filmCardFullComponent;

    this._filmCardComponent = new FilmCardComponent(film);
    this._filmCardFullComponent = new FilmCardFullComponent(film);

    this._comments = this._film.comments;
    const commentsComponent = new CommentsComponent(this._comments, this._emojiName);
    this._commentsComponent = commentsComponent;

    this._filmCardComponent.setClickHandler(() => {
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

    this._filmCardFullComponent.setControlButtonsChangeHandler((buttonID) => {
      if (buttonID === ButtonID.WATCHLIST) {
        this._onDataChange(this, film, (Object.assign({}, this._film, {
          isInWatchlist: !this._film.isInWatchlist,
        })));
      }
      if (buttonID === ButtonID.WATCHED) {
        this._onDataChange(this, film, (Object.assign({}, this._film, {
          isWatched: !this._film.isWatched,
        })));
      }
      if (buttonID === ButtonID.FAVORITE) {
        this._onDataChange(this, film, (Object.assign({}, this._film, {
          isFavorite: !this._film.isFavorite,
        })));
      }
    });

    if (oldFilmCardComponent && oldFilmCardFullComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._filmCardFullComponent, oldFilmCardFullComponent);
      render(this._filmCardFullComponent.getElement(), this._commentsComponent);
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

  _showFilmPopup() {
    this._onViewChange();
    this._filmCardFullComponent.rerender();

    render(this._container, this._filmCardFullComponent);
    render(this._filmCardFullComponent.getElement(), this._commentsComponent);
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
