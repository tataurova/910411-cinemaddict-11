import {createProfileTemplate} from "./components/profile.js";
import {createFilterTemplate} from "./components/filter.js";
import {createSortTemplate} from  "./components/sort.js";
import {createFilmBlockTemplate} from "./components/film-block.js";
import {createFilmListTemplate} from "./components/film-list.js";
import {createCardTemplate} from "./components/card.js";
import {createShowMoreButtonTemplate} from "./components/show-more-button.js";
import {createStatsTemplate} from "./components/stats.js";
import {createFilmDetailsTemplate} from "./components/film-details.js";
import {generateFilms} from "./mock/film.js";
import {CardCount} from "./const.js";

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

const films = generateFilms(CardCount.MAIN);
const filmCount = films.length;

const watchStats = films.reduce((count, film) => {
  film.isInWatchlist ? count.watchlist += 1 : count.watchlist;
  film.isWatched ? count.history += 1 : count.history;
  film.isFavorite ? count.favorites += 1 : count.favorites;
  return count;
}, {watchlist: 0,
    history: 0,
    favorites: 0,
    });

render(headerElement, createProfileTemplate(watchStats.history), `beforeend`);
render(siteMainElement, createFilterTemplate(watchStats.watchlist, watchStats.history, watchStats.favorites), `beforeend`);
render(siteMainElement, createSortTemplate(), `beforeend`);
render(siteMainElement, createFilmBlockTemplate(), `beforeend`);

const filmBlockElement = siteMainElement.querySelector(`.films`);

render(filmBlockElement, createFilmListTemplate({title: `All movies. Upcoming`, isExtra: false, isNoHeader: true}), `beforeend`);

const filmListContainerElement = siteMainElement.querySelector(`.films-list__container`);
const filmListElement = siteMainElement.querySelector(`.films-list`);

films.slice(0, CardCount.ON_START).
  forEach((film) => render(filmListContainerElement, createCardTemplate(film), `beforeend`));

let showingFilmCount = CardCount.ON_START;

render(filmListElement, createShowMoreButtonTemplate(), `beforeend`);

render(filmBlockElement, createFilmListTemplate({title: `Top rated`, isExtra: true}), `beforeend`);
render(filmBlockElement, createFilmListTemplate({title: `Most commented`, isExtra: true}), `beforeend`);

const filmTopListElement = siteMainElement.querySelector(`.films-list--extra:nth-child(2) .films-list__container`);
const filmCommentedListElement = siteMainElement.querySelector(`.films-list--extra:nth-child(3) .films-list__container`);

films.slice(0, CardCount.TOP).
  forEach((film) => render(filmTopListElement, createCardTemplate(film), `beforeend`));
films.slice(0, CardCount.COMMENTED).
  forEach((film) => render(filmCommentedListElement, createCardTemplate(film), `beforeend`));

const footerStatisticElement = document.querySelector(`.footer__statistics`);

render(footerStatisticElement, createStatsTemplate(filmCount), `beforeend`);

const bodyElement = document.querySelector(`body`);
render(bodyElement, createFilmDetailsTemplate(films[0]), `beforeend`);

const showMoreButtonElement = document.querySelector(`.films-list__show-more`);

showMoreButtonElement.addEventListener(`click`, () => {
  const prevFilmCount = showingFilmCount;
  showingFilmCount = showingFilmCount + CardCount.BY_BUTTON;

  films.slice(prevFilmCount, showingFilmCount)
    .forEach((film) => render(filmListContainerElement, createCardTemplate(film), `beforeend`));

  if (showingFilmCount >= films.length) {
    showMoreButtonElement.remove();
  };
});
