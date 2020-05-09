import AbstractComponent from "./abstract-component.js";
import {activateElement} from "../utils/interactivity";
import {SHOWING_FILTERED_FILMS_COUNT} from "../const.js";

const createFilterTemplate = (filters) => {
  const [, watchlist, history, favorites] = filters;

  return (
    `<div class="main-navigation__items">
        <a href="#all" data-filter-name="all" class="main-navigation__item main-navigation__item--active">All movies</a>
        <a href="#watchlist" data-filter-name="watchlist" class="main-navigation__item">Watchlist
          ${watchlist.count < SHOWING_FILTERED_FILMS_COUNT
      ? `<span class="main-navigation__item-count">${watchlist.count}</span>`
      : ``}
        </a>
        <a href="#history" data-filter-name="history" class="main-navigation__item">History
          ${history.count < SHOWING_FILTERED_FILMS_COUNT
      ? `<span class="main-navigation__item-count">${history.count}</span>`
      : ``}
        </a>
        <a href="#favorites" data-filter-name="favorites" class="main-navigation__item">Favorites
          ${favorites.count < SHOWING_FILTERED_FILMS_COUNT
      ? `<span class="main-navigation__item-count">${favorites.count}</span>`
      : ``}
        </a>
      </div>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const filterName = evt.target.dataset.filterName;
      if (this._currentFilterName === filterName) {
        return;
      }

      activateElement(evt.target, this.getElement(), `main-navigation__item--active`);

      this._currentFilterName = filterName;

      handler(filterName);
    });
  }
}
