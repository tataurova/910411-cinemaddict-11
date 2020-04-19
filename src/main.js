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
import {CardCount, KEYBOARD_KEYS} from "./const.js";
import {render, remove, RenderPosition} from "./utils.js";

const headerElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const footerStatisticElement = document.querySelector(`.footer__statistics`);

const renderFilm = (filmListContainerElement, film) => {
  const showFilmPopup = () => {
    bodyElement.appendChild(filmDetailsComponent.getElement());
  };

  const hideFilmPopup = () => {
    bodyElement.removeChild(filmDetailsComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = (evt) => {
      return evt.key === KEYBOARD_KEYS.ESCAPE_CODE || evt.key === KEYBOARD_KEYS.ESC_CODE;
    };

    if (isEscKey) {
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
  const closeButton = filmDetailsComponent.getElement().querySelector(`.film-details__close-btn`);

  posterElement.addEventListener(`click`, () => {
    showFilmPopup();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  filmHeaderElement.addEventListener(`click`, () => {
    showFilmPopup();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  filmRatingElement.addEventListener(`click`, () => {
    showFilmPopup();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  closeButton.addEventListener(`click`, () => {
    hideFilmPopup();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(filmListContainerElement, cardComponent.getElement());
};

const renderFilmBlock = (filmBlockComponent, films) => {
  if (!films.length) {
    render(filmBlockComponent.getElement(), new NoFilmsComponent().getElement());
    return;
  };

  const ratingSortedFilms = films.slice();
  const commentsSortedFilms = films.slice();

  ratingSortedFilms.sort((a, b) => (b.rating - a.rating));
  commentsSortedFilms.sort((a, b) => b.comments.length - a.comments.length);

  const filmListComponent = new FilmListComponent({title: `All movies. Upcoming`, isExtra: false, isNoHeader: true});
  render(filmBlockComponent.getElement(), filmListComponent.getElement());
  const filmListContainerComponent = new FilmListContainerComponent();
  render(filmListComponent.getElement(), filmListContainerComponent.getElement());
  films.slice(0, CardCount.ON_START).forEach((film) => renderFilm(filmListContainerComponent.getElement(), film));

  const isFilmsNoneZeroRating = films.some((film) => film.rating > 0);

  if (isFilmsNoneZeroRating) {
    const filmTopListComponent = new FilmListComponent({title: `Top rated`, isExtra: true});
    render(filmBlockComponent.getElement(), filmTopListComponent.getElement());
    const filmTopListContainerComponent = new FilmListContainerComponent();
    render(filmTopListComponent.getElement(), filmTopListContainerComponent.getElement());
    ratingSortedFilms.slice(0, CardCount.TOP).forEach((film) => renderFilm(filmTopListContainerComponent.getElement(), film));
  };

  const ifFilmsWithComments = films.some((film) => film.comments.length);

  if (ifFilmsWithComments) {
    const filmCommentedListComponent = new FilmListComponent({title: `Most Commented`, isExtra: true});
    render(filmBlockComponent.getElement(), filmCommentedListComponent.getElement());
    const filmCommentedContainerComponent = new FilmListContainerComponent();
    render(filmCommentedListComponent.getElement(), filmCommentedContainerComponent.getElement());
    commentsSortedFilms.slice(0, CardCount.COMMENTED).forEach((film) => renderFilm(filmCommentedContainerComponent.getElement(), film));
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

const watchStats = getWatchStats(films);

render(headerElement, new ProfileComponent(watchStats).getElement());
render(siteMainElement, new FilterComponent(watchStats).getElement());
render(siteMainElement, new SortComponent().getElement());
render(footerStatisticElement, new StatsComponent(films.length).getElement());

const filmBlockComponent = new FilmBlockComponent();

render(siteMainElement, filmBlockComponent.getElement());
renderFilmBlock(filmBlockComponent, films);
