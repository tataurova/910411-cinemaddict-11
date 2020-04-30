import {SortType} from "../const.js";

export const getSortedFilms = ([...films], sortType) => {
  switch (sortType) {
    case SortType.DATE_DOWN:
      return films.sort((a, b) => b.productionDate - a.productionDate);
    case SortType.RATING_DOWN:
      return films.sort((a, b) => b.rating - a.rating);
    case SortType.COMMENTS_DOWN:
      return films.sort((a, b) => b.comments.length - a.comments.length);
    case SortType.DEFAULT:
      return films;
    default:
      throw new Error(`Unknown sort type: ${sortType}`);
  }
};
