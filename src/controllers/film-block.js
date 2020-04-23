import FilmListComponent from "../components/film-list.js";
import FilmListContainerComponent from "../components/film-list-container.js";
import SortComponent from "../components/sort.js";
import CardComponent from "../components/card.js";
import FilmDetailsComponent from "../components/film-details.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import NoFilmsComponent from "../components/no-films.js";
import {CardCount, SortType, RenderPosition} from "../const.js";
import {render, remove} from "../utils/render.js";
import {isEscKey} from "../utils/keyboard.js";

const renderFilm = (filmListContainerElement, film) => {
  const showFilmPopup = () => {
    render(bodyElement, filmDetailsComponent);
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
  const filmDetailsComponent = new FilmDetailsComponent(film);

  cardComponent.setFilmClickHandler(() => {
    showFilmPopup();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  filmDetailsComponent.setCloseButtonHandler(() => {
    hideFilmPopup();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(filmListContainerElement, cardComponent);
};

const getSortedFilms = (films, sortType) => {
  let sortedFilms = [];
  const showingFilms = films.slice();

  switch (sortType) {
    case SortType.DATE_DOWN:
      sortedFilms = showingFilms.sort((a, b) => b.productionDate - a.productionDate);
      break;
    case SortType.RATING_DOWN:
      sortedFilms = showingFilms.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.DEFAULT:
      sortedFilms = showingFilms;
      break;
  }

  return sortedFilms;
};

const renderFilms = (filmListElement, films) => {
  films.forEach((film) => {
    renderFilm(filmListElement, film);
  });
};

export default class FilmBlockController {
  constructor(container) {
    this._container = container;

    this._sortComponent = new SortComponent();
    this._noFilmsComponent = new NoFilmsComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
  }

  render(films) {
    const container = this._container.getElement();
    render(container, this._sortComponent, RenderPosition.BEFOREBEGIN);

    let showingFilmCount = CardCount.ON_START;

    const renderShowMoreButton = () => {
      render(filmListContainerElement, this._showMoreButtonComponent, RenderPosition.AFTERBEGIN);

      this._showMoreButtonComponent.setClickHandler(() => {
        const prevFilmCount = showingFilmCount;
        showingFilmCount = showingFilmCount + CardCount.BY_BUTTON;

        renderFilms(filmListContainerElement, films.slice(prevFilmCount, showingFilmCount));

        if (showingFilmCount >= films.length) {
          remove(this._showMoreButtonComponent);
        }
      });
    };

    if (films.length === 0) {
      render(this._container, this._noFilmsComponent);
      return;
    }

    const ratingSortedFilms = films.slice();
    const commentsSortedFilms = films.slice();

    ratingSortedFilms.sort((a, b) => b.rating - a.rating);
    commentsSortedFilms.sort((a, b) => b.comments.length - a.comments.length);

    const renderFilmListContainer = ({title, isExtra}, filmsForBlock, count) => {
      const filmListComponent = new FilmListComponent({title, isExtra});
      const filmListContainerComponent = new FilmListContainerComponent();

      render(container, filmListComponent);
      render(filmListComponent.getElement(), filmListContainerComponent);
      renderFilms(filmListContainerComponent.getElement(), filmsForBlock.slice(0, count));

      return filmListContainerComponent.getElement();
    };

    const filmListContainerElement = renderFilmListContainer({title: `All movies. Upcoming`, isExtra: false,
      isNoHeader: true}, films, CardCount.ON_START);

    if (ratingSortedFilms[0].rating > 0) {
      renderFilmListContainer({title: `Top rated`, isExtra: true}, ratingSortedFilms, CardCount.TOP);
    }

    if (commentsSortedFilms[0].comments.length > 0) {
      renderFilmListContainer({title: `Most Commented`, isExtra: true}, commentsSortedFilms, CardCount.COMMENTED);
    }

    renderShowMoreButton();

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      showingFilmCount = CardCount.ON_START;

      const sortedFilms = getSortedFilms(films, sortType);

      filmListContainerElement.innerHTML = ``;

      renderFilms(filmListContainerElement, sortedFilms.slice(0, showingFilmCount));
      renderShowMoreButton();

      films = sortedFilms;
    });
  }
}

