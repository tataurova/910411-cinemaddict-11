import {createProfileTemplate} from "./components/profile.js";
import {createFilterTemplate} from "./components/filter.js";
import {createSortTemplate} from  "./components/sort.js";
import {createFilmBlockTemplate} from "./components/film-block.js";
import {createFilmListTemplate} from "./components/film-list.js";
import {createCardTemplate} from "./components/card.js";
import {createShowMoreButtonTemplate} from "./components/show-more-button.js";
import {createFooterStatisticsTemplate} from "./components/footer-statistics.js";
import {createFilmDetailsTemplate} from "./components/film-details.js";

const CardCount = {
  MAIN: 5,
  TOP: 2,
  COMMENTED: 2
};

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(headerElement, createProfileTemplate(), `beforeend`);
render(siteMainElement, createFilterTemplate(), `beforeend`);
render(siteMainElement, createSortTemplate(), `beforeend`);
render(siteMainElement, createFilmBlockTemplate(), `beforeend`);

const filmBlockElement = siteMainElement.querySelector(`.films`);

render(filmBlockElement, createFilmListTemplate({title: `All movies. Upcoming`, isExtra: false}), `beforeend`);

const filmListContainerElement = siteMainElement.querySelector(`.films-list__container`);
const filmListElement = siteMainElement.querySelector(`.films-list`);

for (let i = 0; i < CardCount.MAIN; i++) {
  render(filmListContainerElement, createCardTemplate(), `beforeend`);
}

render(filmListElement, createShowMoreButtonTemplate(), `beforeend`);

render(filmBlockElement, createFilmListTemplate({title: `Top rated`, isExtra: true}), `beforeend`);
render(filmBlockElement, createFilmListTemplate({title: `Most commented`, isExtra: true}), `beforeend`);

const filmTopListElement = siteMainElement.querySelector(`.films-list--extra:nth-child(2) .films-list__container`);
const filmCommentedListElement = siteMainElement.querySelector(`.films-list--extra:nth-child(3) .films-list__container`);

for (let i = 0; i < CardCount.TOP; i++) {
  render(filmTopListElement, createCardTemplate(), `beforeend`);
}

for (let i = 0; i < CardCount.COMMENTED; i++) {
  render(filmCommentedListElement, createCardTemplate(), `beforeend`);
}

const footerStatisticElement = document.querySelector(`.footer__statistics`);

render(footerStatisticElement, createFooterStatisticsTemplate(), `beforeend`);

const bodyElement = document.querySelector(`body`);
render(bodyElement, createFilmDetailsTemplate(), `beforeend`);
