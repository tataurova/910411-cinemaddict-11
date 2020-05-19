import AbstractComponent from "./abstract-component.js";
import {activateElement} from "../utils/interactivity";
import {FilterType} from "../const.js";
import {getFilterNameById} from "../utils/filter.js";
import {SHOWING_FILTERED_FILMS_COUNT} from "../const.js";

const FILTER_ID_PREFIX = `filter__`;

const filterMarkupTemplate = (filters) => {
  return filters.map((filter) => {
    return (
      `<a href="#${filter.name}"
       id="filter__${filter.name}"
       class="main-navigation__item${filter.active ? ` main-navigation__item--active` : ``}">${filter.name === FilterType.ALL ? `All movies` : filter.name}
       ${filter.count < SHOWING_FILTERED_FILMS_COUNT
        ? `<span class="main-navigation__item-count">${filter.count}</span>`
        : ``}</a>`
    );
  }).join(`\n`);
};

const createFilterTemplate = (filters) => {
  return (
    `<div class="main-navigation__items">
        ${filterMarkupTemplate(filters)}
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
      const filterName = getFilterNameById(FILTER_ID_PREFIX, evt.target.id);
      handler(filterName);
      activateElement(evt.target, this.getElement(), `main-navigation__item--active`);
    });
  }
}
