import {CardCount, SortType, RenderPosition} from "../const.js";
import {getSortedFilms} from "../utils/sort.js";
import FilmController from "./film.js";
import FilmListComponent from "../components/film-list.js";
import FilmListContainerComponent from "../components/film-list-container.js";
import {render, remove} from "../utils/render.js";
import SortComponent from "../components/sort.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";

const renderFilms = (container, films, onDataChange, onViewChange, onCommentChange, updateCommentedFilms, commentsModel, api) => {
  return films.map((film) => {
    const comments = commentsModel.getCommentsById(film.id);

    const filmController = new FilmController(container, onDataChange, onViewChange, onCommentChange,
      updateCommentedFilms, api);
    console.log(comments);
    filmController.render(film, comments);
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

    render(container, this._sortComponent);

    if (films.length === 0) {
      const filmListComponentNoFilms = new FilmListComponent({title: `There are no movies in our database`});
      render(container, filmListComponentNoFilms);
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

    const newFilms = renderFilms(this._filmListContainerComponent.getElement(), films, this._onDataChange,
        this._onViewChange, this._onCommentChange, this._updateCommentedFilms, this._commentsModel, this._api);
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

  }

  _updateFilms(count) {

    this._removeFilms(this._showedFilmControllers);
    this._renderFilms(this._filmsModel.getFilms().slice(0, count));
    this._renderShowMoreButton();

  }

  _updateFilm(oldData, newData, comments) {
    const allShowedControllers = this._showedFilmControllers.concat(this._showedTopFilmControllers, this._showedCommentsFilmControllers);
    const showedFilmControllers = allShowedControllers.filter((controller) => controller.getFilm() === oldData);
    showedFilmControllers.forEach((controller) => controller.render(newData, comments));
  }

  _renderExtraFilms(header, films) {

    const [filmExtraListComponent, filmExtraListContainerComponent] = renderFilmListContainer(this._container, {title: header, isExtra: true});
    const newFilms = renderFilms(filmExtraListContainerComponent.getElement(), films, this._onDataChange,
        this._onViewChange, this._onCommentChange, this._updateCommentedFilms, this._commentsModel, this._api);
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
          this._updateFilm(oldData, newData, this._commentsModel.getCommentsById(oldData.id));
        }
      });
  }

  _onCommentChange(filmController, oldData, newData, commentId, comments) {
        let isSuccess = false;
        let newComments = null;
        if (comments === null) {
          isSuccess = this._commentsModel.deleteComment(oldData.id, commentId) && this._filmsModel.updateFilm(oldData.id, newData);
          newComments = this._commentsModel.getCommentsById(oldData.id);
        };
        if (commentId === null) {
          isSuccess = this._commentsModel.createComment(oldData.id, comments) && this._filmsModel.updateFilm(oldData.id, newData);
          newComments = comments;
        };
        if (isSuccess) {
          this._updateFilm(oldData, newData, newComments);
        }
  }

  _onViewChange() {
    this._showedFilmControllers.forEach((controller) => controller.setDefaultView());
  }

  _onSortTypeChange(sortType) {

    this._showingFilmCount = CardCount.ON_START;
    const sortedFilms = getSortedFilms(this._filmsModel.getFilms(), sortType);

    this._removeFilms(this._showedFilmControllers);
    this._renderFilms(sortedFilms.slice(0, this._showingFilmCount));
    this._renderShowMoreButton();
  }

  _onFilterChange() {
    this._sortComponent.reset();
    this._showingFilmCount = CardCount.ON_START;
    this._updateFilms(CardCount.ON_START);
  }

}
