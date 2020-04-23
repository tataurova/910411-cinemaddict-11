import {RATING_TITLES} from "../const.js";
import AbstractComponent from "./abstract-component.js";

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

export default class Profile extends AbstractComponent {
  constructor(count) {
    super();
    this._count = count;
  }

  getTemplate() {
    return createProfileTemplate(this._count);
  }
}
