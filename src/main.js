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
import NoFilmsComponent from "./components/no-films.js";
import {generateFilms} from "./mock/film.js";
import {CardCount, KeyboardKey} from "./const.js";
import {render, remove, RenderPosition} from "./utils/render.js";
import {isEscKey} from "./utils/keyboard.js";
import {getWatchStats} from "./utils/stats.js";

const headerElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const footerStatisticElement = document.querySelector(`.footer__statistics`);

const renderFilm = (filmListContainerElement, film) => {
  const showFilmPopup = () => {
    render(bodyElement, filmDetailsComponent.getElement());
  };

  const hideFilmPopup = () => {
    remove(filmDetailsComponent);
  };

  const onEscKeyDown = (evt) => {
    if (isEscKey(evt)) {
      hideFilmPopup();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const bodyElement = document.querySelector(`body`);
  const cardComponent = new CardComponent(film);

  const posterElement = cardComponent.getElement().querySelector(`.film-card__poster`);
  const filmHeaderElement = cardComponent.getElement().querySelector(`.film-card__title`);
  const filmRatingElement = cardComponent.getElement().querySelector(`.film-card__rating`);

  const filmDetailsComponent = new FilmDetailsComponent(film);
  const closeButtonElement = filmDetailsComponent.getElement().querySelector(`.film-details__close-btn`);

  const onFilmClick = () => {
    showFilmPopup();
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  posterElement.addEventListener(`click`, onFilmClick);
  filmHeaderElement.addEventListener(`click`, onFilmClick);
  filmRatingElement.addEventListener(`click`, onFilmClick);

  closeButtonElement.addEventListener(`click`, () => {
    hideFilmPopup();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(filmListContainerElement, cardComponent.getElement());
};

const renderFilmListBlock = ({title, isExtra}, films, count) => {
  const filmListComponent = new FilmListComponent({title, isExtra});
  render(filmBlockComponent.getElement(), filmListComponent.getElement());
  const filmListContainerComponent = new FilmListContainerComponent();
  render(filmListComponent.getElement(), filmListContainerComponent.getElement());
  films.slice(0, count).forEach((film) => renderFilm(filmListContainerComponent.getElement(), film));
};

const renderFilmBlock = (filmBlockComponent, films) => {
  if (films.length === 0) {
    render(filmBlockComponent.getElement(), new NoFilmsComponent().getElement());
    return;
  };

  const ratingSortedFilms = films.slice();
  const commentsSortedFilms = films.slice();

  ratingSortedFilms.sort((a, b) => b.rating - a.rating);
  commentsSortedFilms.sort((a, b) => b.comments.length - a.comments.length);

  const filmListComponent = new FilmListComponent({title: `All movies. Upcoming`, isExtra: false, isNoHeader: true});
  render(filmBlockComponent.getElement(), filmListComponent.getElement());
  const filmListContainerComponent = new FilmListContainerComponent();
  render(filmListComponent.getElement(), filmListContainerComponent.getElement());
  films.slice(0, CardCount.ON_START).forEach((film) => renderFilm(filmListContainerComponent.getElement(), film));

  const isFilmsNoneZeroRating = films.some((film) => film.rating > 0);

  if (isFilmsNoneZeroRating) {
      renderFilmListBlock({title: `Top rated`, isExtra: true}, ratingSortedFilms, CardCount.TOP);
  };

  const ifFilmsWithComments = films.some((film) => film.comments.length);

  if (ifFilmsWithComments) {
      renderFilmListBlock({title: `Most Commented`, isExtra: true}, commentsSortedFilms, CardCount.COMMENTED);
  };

  const showMoreButtonComponent = new ShowMoreButtonComponent();
  render(filmListComponent.getElement(), showMoreButtonComponent.getElement());

  let showingFilmCount = CardCount.ON_START;

  showMoreButtonComponent.getElement().addEventListener(`click`, () => {
    const prevFilmCount = showingFilmCount;
    showingFilmCount = showingFilmCount + CardCount.BY_BUTTON;

    films.slice(prevFilmCount, showingFilmCount)
      .forEach((film) => renderFilm(filmListContainerComponent.getElement(), film));

    if (showingFilmCount >= films.length) {
      remove(showMoreButtonComponent);
    };
  });
};

const films = generateFilms(CardCount.MAIN);

const watchStats = getWatchStats(films);

render(headerElement, new ProfileComponent(watchStats).getElement());
render(siteMainElement, new FilterComponent(watchStats).getElement());
render(siteMainElement, new SortComponent().getElement());
render(footerStatisticElement, new StatsComponent(films.length).getElement());

const filmBlockComponent = new FilmBlockComponent();

render(siteMainElement, filmBlockComponent.getElement());
renderFilmBlock(filmBlockComponent, films);
