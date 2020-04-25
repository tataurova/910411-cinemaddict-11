import FilmListComponent from "../components/film-list.js";
import FilmListContainerComponent from "../components/film-list-container.js";
import SortComponent from "../components/sort.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import FilmController from "./film.js";
import {CardCount, SortType, RenderPosition} from "../const.js";
import {render, remove} from "../utils/render.js";

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

const renderFilms = (filmListElement, films, onDataChange, onViewChange) => {
  return films.map((film) => {
    const filmController = new FilmController(filmListElement, onDataChange, onViewChange);
    filmController.render(film);

    return filmController;
  })
};

export default class FilmBlockController {
  constructor(container) {
    this._container = container;

    this._films = [];
    this._showedFilmControllers = [];
    this._showingFilmCount = CardCount.ON_START;

    this._sortComponent = new SortComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);

    this._filmListContainerComponent = null;
  }

  render(films) {
    this._films = films;

    const container = this._container.getElement();

    render(container, this._sortComponent, RenderPosition.BEFOREBEGIN);

    if (films.length === 0) {
      const filmListComponentNoFilms = new FilmListComponent({title: `There are no movies in our database`});
      render(container, filmListComponentNoFilms);
      return;
    }

    const ratingSortedFilms = getSortedFilms(films, SortType.RATING_DOWN);
    const commentsSortedFilms = getSortedFilms(films, SortType.COMMENTS_DOWN);

    const renderFilmListContainer = ({title, isExtra}) => {
      const filmListComponent = new FilmListComponent({title, isExtra});
      const filmListContainerComponent = new FilmListContainerComponent();

      render(container, filmListComponent);
      render(filmListComponent.getElement(), filmListContainerComponent);

      return filmListContainerComponent;
    };

    const filmListContainerComponent = renderFilmListContainer({title: `All movies. Upcoming`, isExtra: false,
      isNoHeader: true}, films, CardCount.ON_START);

    const newFilms = renderFilms(filmListContainerComponent.getElement(),
      this._films.slice(0, CardCount.ON_START), this._onDataChange, this._onViewChange);
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

    this._filmListContainerComponent = filmListContainerComponent;

    if (ratingSortedFilms[0].rating > 0) {
      const filmTopListContainerComponent = renderFilmListContainer({title: `Top rated`, isExtra: true});

      const newFilms = renderFilms(filmTopListContainerComponent.getElement(),
        ratingSortedFilms.slice(0, CardCount.TOP), this._onDataChange, this._onViewChange);

      this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);
    }

    if (commentsSortedFilms[0].comments.length > 0) {
      const filmCommentedListContainerComponent = renderFilmListContainer({title: `Most Commented`, isExtra: true});

      const newFilms = renderFilms(filmCommentedListContainerComponent.getElement(),
        commentsSortedFilms.slice(0, CardCount.COMMENTED), this._onDataChange, this._onViewChange);

      this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);
    }

    this._renderShowMoreButton();
  }

  _renderShowMoreButton() {
    const container = this._container.getElement();
    const filmListContainerElement = this._filmListContainerComponent.getElement();

    render(filmListContainerElement, this._showMoreButtonComponent, RenderPosition.AFTERBEGIN);

    this._showMoreButtonComponent.setClickHandler(() => {
      const prevFilmCount = this._showingFilmCount;
      this._showingFilmCount += CardCount.BY_BUTTON;

      const sortedFilms = getSortedFilms(this._films, this._sortComponent.getSortType());

      const newFilms = renderFilms(filmListContainerElement,
        sortedFilms.slice(prevFilmCount, this._showingFilmCount), this._onDataChange, this._onViewChange);

      this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

      if (this._showingFilmCount >= this._films.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  };

  _onDataChange(filmController, oldData, newData) {
    const index = this._films.findIndex((film) => film === oldData);

    if (index !== -1) {
      this._films = [].concat(this._films.slice(0, index), newData, this._films.slice(index + 1));

      filmController.render(this._films[index]);
    }
  }

  _onViewChange() {
    this._showedFilmControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._showingFilmCount = CardCount.ON_START;

    const sortedFilms = getSortedFilms(this._films, sortType);

    const filmListContainerElement = this._filmListContainerComponent.getElement();

    filmListContainerElement.innerHTML = ``;

    const newFilms = renderFilms(filmListContainerElement, sortedFilms.slice(0, this._showingFilmCount), this._onDataChange, this._onViewChange);
    this._showedFilmControllers = newFilms;

    this._renderShowMoreButton();
  }

}

