import {filmCount} from "../main.js";

export const createStatsTemplate = () => {
  const newFormatCount = filmCount.toString().replace(/(\d)(?=(\d{3})+(\D|$))/g, `$1 `);
  return (
    `<p>${newFormatCount} movies inside</p>`
  );
};
