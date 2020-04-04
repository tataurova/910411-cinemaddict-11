export const createFilmListTemplate = ({title, isExtra = false}) => {
  return (
    `<section class="films-list${isExtra ? `--extra` : ``}">
      <h2 class="films-list__title">${title}</h2>
      <div class="films-list__container"></div>
     </section>`
  );
};
