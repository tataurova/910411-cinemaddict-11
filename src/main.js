import {createProfileTemplate} from "./components/profile.js";
import {createFilterTemplate} from "./components/filter.js";
import {createSortTemplate} from  "./components/sort.js";
import {createFilmBlockTemplate} from "./components/film-block.js";
import {createFilmListTemplate} from "./components/film-list.js";
import {createCardTemplate} from "./components/card.js";
import {createShowMoreButtonTemplate} from "./components/show-more-button.js";
import {createStatsTemplate} from "./components/footer-statistic.js";
import {createFilmDetailsTemplate} from "./components/film-details.js";
import {generateFilms} from "./mock/film.js"

const CardCount = {
  MAIN: 20,
  TOP: 2,
  COMMENTED: 2
};

const SHOWING_FILMS_COUNT_ON_START = 8;
const SHOWING_FILMS_COUNT_BY_BUTTON = 8;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

const films = generateFilms(CardCount.MAIN);

const countInWatchListFilms = films.filter((el) => el.isInWatchlist === true).length;
const countWatchedFilms = films.filter((el) => el.isWatched === true).length;
const countFavoriteFilms = films.filter((el) => el.isFavorite === true).length;

render(headerElement, createProfileTemplate(), `beforeend`);
render(siteMainElement, createFilterTemplate(countInWatchListFilms, countWatchedFilms, countFavoriteFilms), `beforeend`);
render(siteMainElement, createSortTemplate(), `beforeend`);
render(siteMainElement, createFilmBlockTemplate(), `beforeend`);

const filmBlockElement = siteMainElement.querySelector(`.films`);

render(filmBlockElement, createFilmListTemplate({title: `All movies. Upcoming`, isExtra: false, isNoHeader: true}), `beforeend`);

const filmListContainerElement = siteMainElement.querySelector(`.films-list__container`);
const filmListElement = siteMainElement.querySelector(`.films-list`);

films.slice(0, CardCount.MAIN).forEach((film) => render(filmListContainerElement, createCardTemplate(film), `beforeend`));

let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

render(filmListElement, createShowMoreButtonTemplate(), `beforeend`);

render(filmBlockElement, createFilmListTemplate({title: `Top rated`, isExtra: true}), `beforeend`);
render(filmBlockElement, createFilmListTemplate({title: `Most commented`, isExtra: true}), `beforeend`);

const filmTopListElement = siteMainElement.querySelector(`.films-list--extra:nth-child(2) .films-list__container`);
const filmCommentedListElement = siteMainElement.querySelector(`.films-list--extra:nth-child(3) .films-list__container`);

films.slice(0, CardCount.TOP).forEach((film) => render(filmTopListElement, createCardTemplate(film), `beforeend`));
films.slice(0, CardCount.COMMENTED).forEach((film) => render(filmCommentedListElement, createCardTemplate(film), `beforeend`));

const footerStatisticElement = document.querySelector(`.footer__statistics`);

render(footerStatisticElement, createStatsTemplate(), `beforeend`);

const bodyElement = document.querySelector(`body`);
render(bodyElement, createFilmDetailsTemplate(films[0]), `beforeend`);

const loadMoreButton = document.querySelector(`.films-list__show-more`);

loadMoreButton.addEventListener(`click`, () => {
  const prevFilmCount = showingFilmsCount;
  showingFilmsCount = showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

  films.slice(prevFilmCount, showingFilmsCount).forEach((film) => render(filmListContainerElement, createCardTemplate(film), `beforeend`));

  if (showingFilmsCount >= films.length) {
    loadMoreButton.remove();
  };
});
