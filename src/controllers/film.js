import {isEscKey, isCtrlAndEnter} from "../utils/keyboard.js";
import FilmCardComponent from "../components/film-card.js";
import FilmCardFullComponent from "../components/film-card-full.js";
import FilmModel from "../models/film.js";
import {FilmCardViewMode as ViewMode, ButtonID} from "../const.js";
import {render, remove, replace} from "../utils/render.js";

export default class FilmController {
  constructor(container, onDataChange, onViewChange, updateCommentedFilms, commentsModel) {
    this._container = container;
    this._commentsModel = commentsModel;
    this._film = null;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._updateCommentedFilms = updateCommentedFilms;
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
    this._filmCardFullComponent = new FilmCardFullComponent(film, this._commentsModel);

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

    this._filmCardFullComponent.setDeleteCommentButtonClickHandler((evt) => {
      evt.preventDefault();

      const deleteButtonElement = evt.target;
      const commentItem = deleteButtonElement.closest(`.film-details__comment`);
      const removeCommentId = commentItem.dataset.id;
      const comments = this._film.comments.filter((comment) => comment.id !== removeCommentId);

      this._onDataChange(this, this._film, Object.assign(this._film, {comments}));
    });

    this._filmCardFullComponent.setAddNewCommentHandler((evt) => {
      if (isCtrlAndEnter(evt)) {
        const comment = this._filmCardFullComponent.getNewComment();
        if (comment) {
          const newComments = this._film.comments.concat(comment);
          this._onDataChange(this, this._film, Object.assign(this._film, {comments: newComments}));
        }
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
