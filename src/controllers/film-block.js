import FilmListComponent from "../components/film-list.js";
import FilmListContainerComponent from "../components/film-list-container.js";
import SortComponent from "../components/sort.js";
import FilmCardComponent from "../components/film-card.js";
import FilmCardFullComponent from "../components/film-card-full.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import {CardCount, SortType, RenderPosition} from "../const.js";
import {render, remove} from "../utils/render.js";
import {isEscKey} from "../utils/keyboard.js";

const renderFilm = (filmListContainerElement, film) => {
  const showFilmPopup = () => {
    render(bodyElement, filmCardFullComponent);
  };

  const hideFilmPopup = () => {
    remove(filmCardFullComponent);
  };

  const onEscKeyDown = (evt) => {
    if (isEscKey(evt)) {
      hideFilmPopup();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const bodyElement = document.querySelector(`body`);

  const filmCardComponent = new FilmCardComponent(film);
  const filmCardFullComponent = new FilmCardFullComponent(film);

  filmCardComponent.setFilmClickHandler(() => {
    showFilmPopup();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  filmCardFullComponent.setCloseButtonHandler(() => {
    hideFilmPopup();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(filmListContainerElement, filmCardComponent);
};

const getSortedFilms = ([...films], sortType) => {
  switch (sortType) {
    case SortType.DATE_DOWN:
      return films.sort((a, b) => b.productionDate - a.productionDate);
    case SortType.RATING_DOWN:
      return films.sort((a, b) => b.rating - a.rating);
    case SortType.COMMENTS_DOWN:
      return films.sort((a, b) => b.comments.length - a.comments.length);
    case SortType.DEFAULT:
      return films;
    default:
      throw new Error(`Unknown sort type: ${sortType}`);
  }
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
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
  }

  render(films) {
    const container = this._container.getElement();
    render(container, this._sortComponent, RenderPosition.BEFOREBEGIN);

    if (films.length === 0) {
      const filmListComponentNoFilms = new FilmListComponent({title: `There are no movies in our database`});
      render(container, filmListComponentNoFilms);
      return;
    }

    let showingFilmCount = CardCount.ON_START;

    const renderShowMoreButton = () => {
      render(filmListContainerElement, this._showMoreButtonComponent, RenderPosition.AFTERBEGIN);

      this._showMoreButtonComponent.setClickHandler(() => {
        const prevFilmCount = showingFilmCount;
        showingFilmCount += CardCount.BY_BUTTON;

        renderFilms(filmListContainerElement, films.slice(prevFilmCount, showingFilmCount));

        if (showingFilmCount >= films.length) {
          remove(this._showMoreButtonComponent);
        }
      });
    };

    const ratingSortedFilms = getSortedFilms(films, SortType.RATING_DOWN);
    const commentsSortedFilms = getSortedFilms(films, SortType.COMMENTS_DOWN);

    const renderFilmListContainer = ({title, isExtra}) => {
      const filmListComponent = new FilmListComponent({title, isExtra});
      const filmListContainerComponent = new FilmListContainerComponent();

      render(container, filmListComponent);
      render(filmListComponent.getElement(), filmListContainerComponent);

      return filmListContainerComponent.getElement();
    };

    const filmListContainerElement = renderFilmListContainer({title: `All movies. Upcoming`, isExtra: false,
      isNoHeader: true}, films, CardCount.ON_START);
    renderFilms(filmListContainerElement, films.slice(0, CardCount.ON_START));

    if (ratingSortedFilms[0].rating > 0) {
      const filmTopListContainerElement = renderFilmListContainer({title: `Top rated`, isExtra: true});
      renderFilms(filmTopListContainerElement, ratingSortedFilms.slice(0, CardCount.TOP));
    }

    if (commentsSortedFilms[0].comments.length > 0) {
      const filmCommentedListContainerElement = renderFilmListContainer({title: `Most Commented`, isExtra: true});
      renderFilms(filmCommentedListContainerElement, commentsSortedFilms.slice(0, CardCount.COMMENTED));
    }

    renderShowMoreButton();

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      showingFilmCount = CardCount.ON_START;

      const sortedFilms = getSortedFilms(films, sortType);

      filmListContainerElement.innerHTML = ``;

      renderFilms(filmListContainerElement, sortedFilms.slice(0, showingFilmCount));
      renderShowMoreButton();
    });
  }
}

