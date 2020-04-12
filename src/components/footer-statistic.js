import {countFilms} from "../mock/film.js";

export const createStatsTemplate = () => {
  const setNewFormatCount = countFilms.toString().replace(/(\d)(?=(\d{3})+(\D|$))/g, `$1 `);
  return (
    `<p>${setNewFormatCount} movies inside</p>`
  );
};
