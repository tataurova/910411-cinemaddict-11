import {RATING_TITLES} from "../const.js";
import {createElement} from "../utils.js";

const getProfileRating = (value) => RATING_TITLES
   .find(({rating}) => rating <= value)
   .title;


const createProfileTemplate = ({history}) => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${getProfileRating(history)}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
     </section>`
  );
};

export default class Profile {
  constructor(count) {
    this._count = count;
    this._element = null;
  }

  getTemplate() {
    return createProfileTemplate(this._count);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
