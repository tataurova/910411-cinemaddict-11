import AbstractSmartComponent from "./abstract-smart-component.js";
import {COMMENT_EMOJIS} from "../const.js";
import moment from "moment";

const createCommentsHistoryTemplate = (comments) => {
  return comments.map((comment) => {
    const {text, emotion, author, date} = comment;
    const commentDate = moment(date).format(`YYYY/MM/DD`);
    return (
      `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-{emotion}">
            </span>
            <div>
              <p class="film-details__comment-text">${text}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${commentDate}</span>
                <button class="film-details__comment-delete">Delete</button>
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

const createCommentsTemplate = (comments, emojiName) => {
  return (
    `<div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
          ${createCommentsHistoryTemplate(comments)}
        </ul>
         <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label">
          ${emojiName.length > 0 ? `<img src="images/emoji/${emojiName}.png" width="55" height="55" alt="emoji-${emojiName}">` : ``}</div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${emojiName.length > 0 ? `Great movie!` : ``}</textarea>
          </label>

          <div class="film-details__emoji-list">
            ${createEmojiItemTemplate(COMMENT_EMOJIS)}
          </div>
        </div>
      </section>
    </div>`
  );
};

export default class Comments extends AbstractSmartComponent {
  constructor(comments, emojiName) {
    super();
    this._comments = comments;
    this._emojiName = emojiName;
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createCommentsTemplate(this._comments, this._emojiName);
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    element.querySelector(`.film-details__emoji-list`).addEventListener(`change`, (evt) => {
      this._emojiName = evt.target.value;
      this.rerender();
    });

  }

}


