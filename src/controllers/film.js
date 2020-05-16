import {isEscKey} from "../utils/keyboard.js";
import FilmCardComponent from "../components/film-card.js";
import FilmCardFullComponent from "../components/film-card-full.js";
import FilmModel from "../models/film.js";
import {FilmCardViewMode as ViewMode, ButtonID} from "../const.js";
import {render, remove, replace} from "../utils/render.js";

export default class FilmController {
  constructor(container, onDataChange, onViewChange, onCommentChange, updateCommentedFilms, api) {
    this._container = container;
    this._film = null;
    this._comments = null;
    this._api = api;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onCommentChange = onCommentChange;
    this._updateCommentedFilms = updateCommentedFilms;
    this._mode = ViewMode.DEFAULT;

    this._filmCardComponent = null;
    this._filmCardFullComponent = null;

    this._emojiName = ``;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._showFilmPopup = this._showFilmPopup.bind(this);
    this._hideFilmPopup = this._hideFilmPopup.bind(this);
  }

  render(film, comments) {
    this._film = film;
    this._comments = comments;

    const oldFilmCardComponent = this._filmCardComponent;
    const oldFilmCardFullComponent = this._filmCardFullComponent;

    this._filmCardComponent = new FilmCardComponent(film);
    this._filmCardFullComponent = new FilmCardFullComponent(film, comments);

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

  destroy() {
    remove(this._filmCardFullComponent);
    remove(this._filmCardComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _setFilmCardComponentHandlers() {
    this._filmCardComponent.setClickHandler(() => {
      this._showFilmPopup();
    });

    this._filmCardComponent.setAddToWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(this._film);
      newFilm.isInWatchlist = !newFilm.isInWatchlist;
      this._onDataChange(this, this._film, newFilm);
    });

    this._filmCardComponent.setMarkAsWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(this._film);
      newFilm.isWatched = !this._film.isWatched;
      this._onDataChange(this, this._film, newFilm);
    });

    this._filmCardComponent.setFavoriteButtonClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(this._film);
      newFilm.isFavorite = !this._film.isFavorite;
      this._onDataChange(this, this._film, newFilm);
    });
  }

  _setFilmCardFullComponentHandlers() {

    this._filmCardFullComponent.setCloseButtonHandler(() => {
      this._hideFilmPopup();
    });

    this._filmCardFullComponent.setControlButtonsChangeHandler((buttonID) => {
      if (buttonID === ButtonID.WATCHLIST) {
        const newFilm = FilmModel.clone(this._film);
        newFilm.isInWatchlist = !newFilm.isInWatchlist;
        this._onDataChange(this, this._film, newFilm);
      }
      if (buttonID === ButtonID.WATCHED) {
        const newFilm = FilmModel.clone(this._film);
        newFilm.isWatched = !this._film.isWatched;
        this._onDataChange(this, this._film, newFilm);
      }
      if (buttonID === ButtonID.FAVORITE) {
        const newFilm = FilmModel.clone(this._film);
        newFilm.isFavorite = !this._film.isFavorite;
        this._onDataChange(this, this._film, newFilm);
      }
    });

    this._filmCardFullComponent.setDeleteCommentButtonClickHandler((removeCommentId) => {
      this._filmCardFullComponent.disableDeleteButton();

      const newFilm = FilmModel.clone(this._film);
      newFilm.comments = newFilm.comments.filter((commentId) => commentId !== removeCommentId);

      this._api.deleteComment(removeCommentId)
        .then(() => {
          this._onCommentChange(this, this._film, newFilm, removeCommentId, null);
        })
        .catch(() => {
          this._filmCardFullComponent.enableDeleteButton();
          this._filmCardFullComponent.shakeActiveDeleteComment();
        });
    });

    this._filmCardFullComponent.setAddNewCommentHandler((newComment) => {
      if (newComment) {
        const newFilm = FilmModel.clone(this._film);
        this._api.createComment(this._film.id, newComment)
            .then((comments) => {
              newFilm.comments = comments.map((comment) => comment.id);
              this._onCommentChange(this, this._film, newFilm, null, comments);
            })
            .catch(() => {
              this._filmCardFullComponent.setRedFrameTextCommentField();
              this._filmCardFullComponent.shake();
            });
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
    this._updateCommentedFilms();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (isEscKey(evt)) {
      this._hideFilmPopup();
    }
  }
}
