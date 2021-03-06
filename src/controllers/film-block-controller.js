import {CardCount, RenderPosition, SHOWING_FILTERED_FILMS_COUNT, SortType} from "../const.js";
import {getSortedFilms} from "../utils/sort.js";
import FilmController from "./film-controller.js";
import FilmListComponent from "../components/film-list.js";
import FilmListContainerComponent from "../components/film-list-container.js";
import {render, remove} from "../utils/render.js";
import SortComponent from "../components/sort.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";

const renderFilms = (container, films, comments, onDataChange, onViewChange, onCommentChange, updateCommentedFilms, api) => {
  return films.map((film) => {
    const filmController = new FilmController(container, onDataChange, onViewChange, onCommentChange,
        updateCommentedFilms, api);
    filmController.render(film, comments[film.id]);
    return filmController;
  });
};

const renderFilmListContainer = (container, {title, isExtra, isNoHeader}) => {
  const filmListComponent = new FilmListComponent({title, isExtra, isNoHeader});
  const filmListContainerComponent = new FilmListContainerComponent();

  render(container, filmListComponent);
  render(filmListComponent.getElement(), filmListContainerComponent);

  return [filmListComponent, filmListContainerComponent];
};

export default class FilmBlockController {
  constructor(container, filmsModel, commentsModel, api) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._comments = this._commentsModel.getComments();
    this._api = api;

    this._showedFilmControllers = [];
    this._showingFilmCount = CardCount.ON_START;

    this._sortComponent = new SortComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();

    this._loadingFilmList = new FilmListComponent({title: `Loading...`});
    this._filmListComponent = null;
    this._filmListContainerComponent = null;
    this._filmTopListComponent = null;
    this._filmTopListContainerComponent = null;
    this._filmCommentedListComponent = null;
    this._filmCommentedListContainerComponent = null;

    this._showedTopFilmControllers = [];
    this._showedCommentsFilmControllers = [];

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onCommentChange = this._onCommentChange.bind(this);

    this._updateCommentedFilms = this._updateCommentedFilms.bind(this);

    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._filmsModel.setFilterChangeHandler(this._onFilterChange);
  }

  hide() {
    this._container.hide();
  }

  show() {
    this._container.show();
  }

  renderLoadingMessage() {
    render(this._container, this._loadingFilmList);
  }

  removeLoadingMessage() {
    remove(this._loadingFilmList);
  }

  render() {
    const container = this._container;
    const films = this._filmsModel.getFilms();

    render(container, this._sortComponent, RenderPosition.BEFOREBEGIN);

    if (films.length === 0) {
      const filmListComponentNoFilms = new FilmListComponent({title: `There are no movies in our database`});
      render(container, filmListComponentNoFilms, RenderPosition.AFTERBEGIN);
      return;
    }

    [this._filmListComponent, this._filmListContainerComponent] =
      renderFilmListContainer(container, {title: `All movies. Upcoming`, isExtra: false,
        isNoHeader: true});

    this._renderFilms(films.slice(0, CardCount.ON_START));

    this._renderShowMoreButton();

    this._ratingSortedFilms = getSortedFilms(films, SortType.RATING_DOWN);
    this._commentsSortedFilms = getSortedFilms(films, SortType.COMMENTS_DOWN);

    if (this._ratingSortedFilms[0].rating > 0) {
      [this._showedTopFilmControllers, this._filmTopListComponent, this._filmTopListContainerComponent] =
        this._renderExtraFilms(`Top rated`, this._ratingSortedFilms.slice(0, CardCount.TOP));
    }

    if (this._commentsSortedFilms[0].comments.length > 0) {
      [this._showedCommentsFilmControllers, this._filmCommentedListComponent, this._filmTopListContainerComponent] =
        this._renderExtraFilms(`Top commented`, this._commentsSortedFilms.slice(0, CardCount.COMMENTED));
    }

  }

  _removeFilms(filmControllers) {
    filmControllers.forEach((filmController) => filmController.destroy());
    filmControllers = [];
  }

  _renderFilms(films) {
    const newFilms = renderFilms(this._filmListContainerComponent.getElement(), films, this._comments, this._onDataChange,
        this._onViewChange, this._onCommentChange, this._updateCommentedFilms, this._api);
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);
  }

  _updateFilms(films) {
    this._removeFilms(this._showedFilmControllers);
    this._renderFilms(films);
  }

  _updateFilm(oldData, newData) {
    const allShowedControllers = this._showedFilmControllers.concat(this._showedTopFilmControllers, this._showedCommentsFilmControllers);
    const showedFilmControllers = allShowedControllers.filter((controller) => controller.getFilm() === oldData);
    showedFilmControllers.forEach((controller) => controller.render(newData, this._comments[newData.id]));
  }

  _renderExtraFilms(header, films) {
    const [filmExtraListComponent, filmExtraListContainerComponent] = renderFilmListContainer(this._container, {title: header, isExtra: true});
    const newFilms = renderFilms(filmExtraListContainerComponent.getElement(), films, this._comments, this._onDataChange,
        this._onViewChange, this._onCommentChange, this._updateCommentedFilms, this._api);
    return [newFilms, filmExtraListComponent, filmExtraListContainerComponent];
  }

  _updateCommentedFilms() {
    this._removeFilms(this._showedCommentsFilmControllers);
    remove(this._filmCommentedListComponent);

    const films = this._filmsModel.getFilms();
    this._commentsSortedFilms = getSortedFilms(films, SortType.COMMENTS_DOWN);

    if (this._commentsSortedFilms[0].comments.length > 0) {
      [this._showedCommentsFilmControllers, this._filmCommentedListComponent, this._filmTopListContainerComponent] =
        this._renderExtraFilms(`Top commented`, this._commentsSortedFilms.slice(0, CardCount.COMMENTED));
    }

  }

  _renderShowMoreButton() {
    render(this._filmListComponent.getElement(), this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._onShowMoreButtonClick);
  }

  _onShowMoreButtonClick() {
    const films = this._filmsModel.getFilms();
    const prevFilmCount = this._showingFilmCount;
    this._showingFilmCount += CardCount.BY_BUTTON;

    const sortedFilms = getSortedFilms(films, this._sortComponent.getSortType());

    this._renderFilms(sortedFilms.slice(prevFilmCount, this._showingFilmCount));

    if (this._showingFilmCount >= films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _onDataChange(filmController, oldData, newData) {
    this._api.updateFilm(oldData.id, newData)
      .then((filmModel) => {
        const isSuccess = this._filmsModel.updateFilm(oldData.id, filmModel);
        if (isSuccess) {
          this._updateFilm(oldData, newData);
        }
      });
  }

  _onCommentChange(filmController, oldData, newData, newComments) {
    const isSuccess = this._commentsModel.updateComments(oldData.id, newComments)
      && this._filmsModel.updateFilm(oldData.id, newData);
    if (isSuccess) {
      this._updateFilm(oldData, newData);
    }
  }

  _onViewChange() {
    this._showedFilmControllers.forEach((controller) => controller.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    const sortedFilms = getSortedFilms(this._filmsModel.getFilms(), sortType);
    this._updateFilms(sortedFilms.slice(0, this._showingFilmCount));
  }

  _onFilterChange() {
    this._showingFilmCount = CardCount.ON_START;
    this._sortComponent.reset();
    this._updateFilms(this._filmsModel.getFilms().slice(0, CardCount.ON_START));
    this._renderShowMoreButton();
    if (this._filmsModel.getFilms().length <= SHOWING_FILTERED_FILMS_COUNT) {
      remove(this._showMoreButtonComponent);
    }
  }

}
