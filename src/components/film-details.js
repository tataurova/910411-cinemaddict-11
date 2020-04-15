import {COMMENT_EMOJIS} from "../const.js";
import {MONTH_NAMES} from "../const.js";

const createGenresTemplate = (genres) => {
  return genres.map((genre) => {
    return (
      `<span class="film-details__genre">${genre}</span>`
    );
  }).join(`\n`);
};

const createCommentsTemplate = (comments) => {
  return comments.map((comment) => {
    const {text, emotion, author, date} = comment;
    const commentDate = `${date.getFullYear()}/${date.getMonth()}/${date.getDay()}
        ${date.getHours()}:${date.getMinutes()}`;
    return (
      `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
            </span>
            <div>
              <p class="film-details__comment-text">${text}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${commentDate}</span>
                <button class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>`
    );
  }).join(`\n`);
};

const createEmojiItemTemplate = (names) => {
  return names.map((name) => {
    return (
      `<input
        class="film-details__emoji-item visually-hidden"
        name="comment-emoji"
        type="radio"
        id="emoji-${name}"
        value="${name}"
      >
      <label class="film-details__emoji-label" for="emoji-${name}">
        <img src="images/emoji/${name}.png" width="30" height="30" alt="emoji">
      </label>`
    );
  }).join(`\n`);
};

export const createFilmDetailsTemplate = (film) => {
  const {
    poster,
    title,
    rating,
    durationHours,
    durationMinutes,
    genres,
    description,
    comments,
    director,
    writers,
    actors,
    productionDate,
    country,
    ageRating
  } = film;

  const date = `${productionDate.getDay()} ${MONTH_NAMES[productionDate.getMonth()]}`;
  const year = productionDate.getFullYear();

  return (
    `<section class="film-details visually-hidden">
  <form class="film-details__inner" action="" method="get">
    <div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${title}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${date} ${year}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${durationHours}h ${durationMinutes}m</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genres.length === 1 ? `Genre` : `Genres`}</td>
              <td class="film-details__cell">
                ${createGenresTemplate(genres)}
              </td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched">
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite">
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
          ${createCommentsTemplate(comments)}
        </ul>

        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            ${createEmojiItemTemplate(COMMENT_EMOJIS)}
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`
  );
};
