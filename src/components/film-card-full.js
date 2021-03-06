import AbstractSmartComponent from "./abstract-smart-component.js";
import {ButtonStatus, COMMENT_EMOJIS, GENRE_MIN_COUNT} from "../const.js";
import {encode} from "he";
import {formatDuration} from "../utils/common.js";
import {isCtrlAndEnter} from "../utils/keyboard.js";
import moment from "moment";
import {shake} from "../utils/interactivity.js";

const createDetailsRowTemplate = (key, value) => {
  return (
    `<tr class="film-details__row">
      <td class="film-details__term">${key}</td>
      <td class="film-details__cell">${value}</td>
    </tr>`
  );
};

const createGenresTemplate = (genres) => {
  return genres.map((genre) => {
    return (
      `<span class="film-details__genre">${genre}</span>`
    );
  }).join(`\n`);
};

const createCommentsTemplate = (comments) => {

  return comments.map((comment) => {
    const {id, text, emotion, author, date} = comment;
    const commentDate = moment(date, `YYYY/MM/DD`).fromNow();

    return (
      `<li data-id="${id}" class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
            </span>
            <div>
              <p class="film-details__comment-text">${text}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${commentDate}</span>
                <button class="film-details__comment-delete">${ButtonStatus.ENABLED}</button>
              </p>
            </div>
          </li>`
    );
  }).join(`\n`);
};

const createEmojiItemTemplate = (names) => {
  return names.map((name) => {
    return (
      `<input
        class="film-details__emoji-item visually-hidden"
        name="comment-emoji"
        type="radio"
        id="emoji-${name}"
        value="${name}"
      >
      <label class="film-details__emoji-label" for="emoji-${name}">
        <img src="images/emoji/${name}.png" width="30" height="30" alt="emoji">
      </label>`
    );
  }).join(`\n`);
};

const createFilmCardFullTemplate = (film, comments, options = {}) => {

  const {
    poster,
    title,
    alternativeTitle,
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

  const {emojiName} = options;

  const releaseDate = moment(productionDate).format(`D MMMM YYYY`);
  const durationHours = formatDuration(durationMinutes);

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
              <p class="film-details__title-original">Original: ${alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            ${createDetailsRowTemplate(`Director`, director)}
            ${createDetailsRowTemplate(`Writers`, writers.join(`, `))}
            ${createDetailsRowTemplate(`Actors`, actors.join(`, `))}
            ${createDetailsRowTemplate(`Release Date`, `${releaseDate}`)}
            ${createDetailsRowTemplate(`Runtime`, durationHours)}
            ${createDetailsRowTemplate(`Country`, country)}
            ${createDetailsRowTemplate(genres.length === GENRE_MIN_COUNT ? `Genre` : `Genres`, createGenresTemplate(genres))}
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isInWatchlist ? `checked` : ``}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watched">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched ? `checked` : ``}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite ? `checked` : ``}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
        <ul class="film-details__comments-list">
          ${createCommentsTemplate(comments)}
        </ul>
         <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label">
          ${emojiName ? `<img src="images/emoji/${emojiName}.png" width="55" height="55" alt="emoji-${emojiName}">` : ``}</div>
          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${emojiName ? `Great movie!` : ``}</textarea>
          </label>
          <div class="film-details__emoji-list">
            ${createEmojiItemTemplate(COMMENT_EMOJIS)}
          </div>
        </div>
      </section>
    </div>

  </form>
</section>`
  );
};

export default class FilmCardFull extends AbstractSmartComponent {
  constructor(film, comments) {
    super();
    this._film = film;
    this._comments = comments;
    this._emojiName = ``;
    this._closeButtonHandler = null;
    this._controlButtonsChangeHandler = null;
    this._deleteCommentButtonClickHandler = null;
    this._setAddNewCommentHandler = null;
    this._setNewCommentEmoji();
    this._activeDeleteCommentButton = null;
    this._activeDeleteComment = null;
    this._activeTextCommentField = null;
  }

  getTemplate() {
    return createFilmCardFullTemplate(this._film, this._comments, {emojiName: this._emojiName});
  }

  recoveryListeners() {
    this.setCloseButtonHandler(this._closeButtonHandler);
    this.setControlButtonsChangeHandler(this._controlButtonsChangeHandler);
    this.setDeleteCommentButtonClickHandler(this._deleteCommentButtonClickHandler);
    this.setAddNewCommentHandler(this._addNewCommentHandler);
    this._setNewCommentEmoji();
  }

  enableDeleteButton() {
    this._activeDeleteCommentButton.disabled = false;
    this._activeDeleteCommentButton.textContent = ButtonStatus.ENABLED;
  }

  disableDeleteButton() {
    this._activeDeleteCommentButton.disabled = true;
    this._activeDeleteCommentButton.textContent = ButtonStatus.DISABLED;
  }

  enableActiveTextCommentField() {
    this._activeTextCommentField.disabled = false;
  }

  disableActiveTextCommentField() {
    this._activeTextCommentField.disabled = true;
  }

  setRedFrameTextCommentField() {
    this._activeTextCommentField.style.border = `1px solid red`;
  }

  shake() {
    shake(this.getElement());
  }

  shakeActiveDeleteComment() {
    shake(this._activeDeleteComment);
  }

  shakeActiveTextCommentField() {
    shake(this._activeTextCommentField);
  }

  resetAddCommentForm() {
    const textCommentElement = this.getElement().querySelector(`.film-details__comment-input`);
    textCommentElement.value = ``;
    this._emojiName = ``;
  }

  setCloseButtonHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);
    this._closeButtonHandler = handler;
  }

  setControlButtonsChangeHandler(handler) {
    this.getElement().querySelector(`.film-details__controls`).addEventListener(`change`, (evt) => {
      handler(evt.target.id);
    });
    this._controlButtonsChangeHandler = handler;
  }

  setDeleteCommentButtonClickHandler(handler) {
    const deleteCommentsButtons = this.getElement().querySelectorAll(`.film-details__comment-delete`);
    if (deleteCommentsButtons) {
      Array.from(deleteCommentsButtons).forEach((button) => button.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this._activeDeleteCommentButton = button;
        this._activeDeleteComment = button.closest(`.film-details__comment`);
        const activeDeleteCommentId = this._activeDeleteComment.dataset.id;
        handler(activeDeleteCommentId);
      }));
    }
    this._deleteCommentButtonClickHandler = handler;
  }

  setAddNewCommentHandler(handler) {
    const textCommentElement = this.getElement().querySelector(`.film-details__comment-input`);
    textCommentElement.addEventListener(`keydown`, (evt) => {
      this._activeTextCommentField = textCommentElement;
      if (isCtrlAndEnter(evt)) {
        const newComment = this._getNewComment();
        handler(newComment);
      }
    });
    this._addNewCommentHandler = handler;
  }

  _getNewComment() {
    const textCommentElement = this.getElement().querySelector(`.film-details__comment-input`);

    const comment = encode(textCommentElement.value);
    const emotion = this._emojiName;

    if (!emotion || !comment) {
      return null;
    }
    const date = new Date();
    return {
      comment,
      date,
      emotion,
    };
  }

  _setNewCommentEmoji() {
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`change`, (evt) => {
      this._emojiName = evt.target.value;
      this.rerender();
    });
  }
}
