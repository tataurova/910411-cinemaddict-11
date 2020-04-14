import {watchedFilmCount} from "../main.js";
import {ProfileNames, ProfileRatingValues} from "../const.js";

const getProfileRating = (count) => {
  if (count > ProfileRatingValues.LOWER_THRESHOLD_MAX_RATING) {
    return ProfileNames.MAX_RATING;
  }
  if (count >= ProfileRatingValues.LOWER_THRESHOLD_MIN_RATING && count <= ProfileRatingValues.UPPER_THRESHOLD_MIN_RATING) {
    return ProfileNames.MIDDLE_RATING;
  }
  if (count >= ProfileRatingValues.LOWER_THRESHOLD_MIDDLE_RATING && count <= ProfileRatingValues.UPPER_THRESHOLD_MIDDLE_RATING) {
    return ProfileNames.MIN_RATING;
  }
  return ``;
};

export const createProfileTemplate = () => {
  const ratingProfile = getProfileRating(watchedFilmCount);
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${ratingProfile}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
     </section>`
  );
};
