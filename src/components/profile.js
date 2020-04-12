import {countWatchedFilms} from "../mock/profile.js";

const setProfileRating = (count) => {
  if (count > 21) {
    return `Movie Buff`;
  } else if (count >= 1 && count <= 10) {
    return `Novice`;
  } else if (count >= 11 && count <= 20) {
    return `Fan`;
  } else {
    return ``;
  }
};

export const createProfileTemplate = () => {
  const ratingProfile = setProfileRating(countWatchedFilms);
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${ratingProfile}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
     </section>`
  );
};
