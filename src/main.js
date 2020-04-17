import ProfileComponent from "./components/profile.js";
import FilterComponent from "./components/filter.js";
import SortComponent from  "./components/sort.js";
import FilmBlockComponent from "./components/film-block.js";
import FilmListComponent from "./components/film-list.js";
import FilmListContainerComponent from "./components/film-list-container.js";
import CardComponent from "./components/card.js";
import ShowMoreButtonComponent from "./components/show-more-button.js";
import StatsComponent from "./components/stats.js";
import FilmDetailsComponent from "./components/film-details.js";
import {generateFilms} from "./mock/film.js";
import {CardCount} from "./const.js";
import {render, RenderPosition} from "./utils.js";

const headerElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const footerStatisticElement = document.querySelector(`.footer__statistics`);

const renderFilm = (filmListContainerElement, film) => {
  const onFilmClick = () => {
    bodyElement.appendChild(filmDetailsComponent.getElement());
  };

  const onCloseButtonClick = () => {
    bodyElement.removeChild(filmDetailsComponent.getElement());
  };

  const bodyElement = document.querySelector(`body`);
  const cardComponent = new CardComponent(film);

  const poster = cardComponent.getElement().querySelector(`.film-card__poster`);
  const filmHeader = cardComponent.getElement().querySelector(`.film-card__title`);
  const filmRating = cardComponent.getElement().querySelector(`.film-card__rating`);

  const filmDetailsComponent = new FilmDetailsComponent(film);
  const closeButton = filmDetailsComponent.getElement().querySelector(`.film-details__close-btn`);

  poster.addEventListener(`click`, onFilmClick);
  filmHeader.addEventListener(`click`, onFilmClick);
  filmRating.addEventListener(`click`, onFilmClick);

  closeButton.addEventListener(`click`, onCloseButtonClick);

  render(filmListContainerElement, cardComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderFilmBlock = (filmBlockComponent, films) => {
  const filmListComponent = new FilmListComponent({title: `All movies. Upcoming`, isExtra: false, isNoHeader: true});
  const filmTopListComponent = new FilmListComponent({title: `Top rated`, isExtra: true});
  const filmCommentedListComponent = new FilmListComponent({title: `Top rated`, isExtra: true});

  render(filmBlockComponent.getElement(), filmListComponent.getElement(), RenderPosition.BEFOREEND);
  render(filmBlockComponent.getElement(), filmTopListComponent.getElement(), RenderPosition.BEFOREEND);
  render(filmBlockComponent.getElement(), filmCommentedListComponent.getElement(), RenderPosition.BEFOREEND);

  const filmListContainerComponent = new FilmListContainerComponent();
  const filmTopListContainerComponent = new FilmListContainerComponent();
  const filmCommentedContainerComponent = new FilmListContainerComponent();

  render(filmListComponent.getElement(), filmListContainerComponent.getElement(), RenderPosition.BEFOREEND);
  render(filmTopListComponent.getElement(), filmTopListContainerComponent.getElement(), RenderPosition.BEFOREEND);
  render(filmCommentedListComponent.getElement(), filmCommentedContainerComponent.getElement(), RenderPosition.BEFOREEND);

  films.slice(0, CardCount.ON_START).forEach((film) => renderFilm(filmListContainerComponent.getElement(), film));
  films.slice(0, CardCount.TOP).forEach((film) => renderFilm(filmTopListContainerComponent.getElement(), film));
  films.slice(0, CardCount.COMMENTED).forEach((film) => renderFilm(filmCommentedContainerComponent.getElement(), film));

  const showMoreButtonComponent = new ShowMoreButtonComponent();
  render(filmListComponent.getElement(), showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

  let showingFilmCount = CardCount.ON_START;

  showMoreButtonComponent.getElement().addEventListener(`click`, () => {
    const prevFilmCount = showingFilmCount;
    showingFilmCount = showingFilmCount + CardCount.BY_BUTTON;

    films.slice(prevFilmCount, showingFilmCount)
      .forEach((film) => renderFilm(filmListContainerComponent.getElement(), film));

    if (showingFilmCount >= films.length) {
      showMoreButtonComponent.getElement().remove();
      showMoreButtonComponent.removeElement();
    };
  });
};

const films = generateFilms(CardCount.MAIN);

const getWatchStats = (films) => films.reduce((stats, film) => {
  if (film.isInWatchlist) {
    stats.watchlist += 1;
  }
  if (film.isWatched) {
    stats.history += 1;
  }
  if (film.isFavorite) {
    stats.favorites += 1;
  }
  return stats;
}, {watchlist: 0, history: 0, favorites: 0});

render(headerElement, new ProfileComponent(getWatchStats(films).history).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterComponent(getWatchStats(films)).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SortComponent().getElement(), RenderPosition.BEFOREEND);
render(footerStatisticElement, new StatsComponent(films.length).getElement(), RenderPosition.BEFOREEND);

const filmBlockComponent = new FilmBlockComponent();

render(siteMainElement, filmBlockComponent.getElement(), RenderPosition.BEFOREEND);
renderFilmBlock(filmBlockComponent, films);
