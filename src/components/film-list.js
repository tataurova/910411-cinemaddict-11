export const createFilmListTemplate = (info) => {
  const {title, isExtra = false, isNoHeader} = info;
  return (
    `<section class="films-list${isExtra ? `--extra` : ``}">
      <h2 class="films-list__title ${isNoHeader ? `visually-hidden` : ``}">${title}</h2>
      <div class="films-list__container"></div>
     </section>`
  );
};
