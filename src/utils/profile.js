import {RATING_TITLES} from "../const.js";

export const getProfileRating = (value) => RATING_TITLES
   .find(({rating}) => rating <= value)
   .title;
