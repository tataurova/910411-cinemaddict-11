import {RATING_TITLES} from "../const.js";

const getProfileRating = (count) => {
  const profile = RATING_TITLES.find((item) => item.rating <= count);
  return profile.title;
};

export const createProfileTemplate = (count) => {
  const ratingProfile = getProfileRating(count);
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${ratingProfile}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
     </section>`
  );
};
