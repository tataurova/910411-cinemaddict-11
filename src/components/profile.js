import {RATING_TITLES} from "../const.js";

const getProfileRating = (value) => RATING_TITLES
   .find(({rating}) => rating <= value)
   .title;


export const createProfileTemplate = (count) => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${getProfileRating(count)}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
     </section>`
  );
};
