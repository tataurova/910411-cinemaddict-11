export const createCardTemplate = (film) => {
  const {poster, title, rating, yearProduction, duration, genres, description, comments} = film;
  const countComments = comments.length;
  const descriptionFull = description.join(` `);
  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${yearProduction}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genres.join(` `)}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">
        ${description.length < 140 ? `${descriptionFull.slice(1, 139)}...` : `${descriptionFull}`}
      </p>
      <a class="film-card__comments">${countComments} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
    </article>`
  );
};
