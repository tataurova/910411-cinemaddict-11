import AbstractSmartComponent from "./abstract-smart-component.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {FilterPeriod, FILTER_PERIOD_DIFFERENCE, RATING_TITLES, StatisticFilterType} from "../const.js";
import {getFilterNameById} from "../utils/filter.js";
import {getHoursDuration, getMinutesDuration} from "../utils/common.js";
import moment from "moment";

const getProfileRating = (value) => RATING_TITLES
   .find(({rating}) => rating <= value)
   .title;

const BAR_HEIGHT = 50;
const FILTER_ID_PREFIX = `statistic-`;

const getFilmsGenres = (films) => {
  let genresAll = new Set();
  films.forEach((film) => {
    film.genres.forEach((genre) => {
      genresAll.add(genre);
    });
  });

  return Array.from(genresAll);
};

const getCountFilmsByGenre = (films) => {
  if (films.length === 0) {
    return [];
  }
  const genres = getFilmsGenres(films);
  const genresStatistic = genres.map((genre) => {
    return {
      genreName: genre,
      count: 0,
    };
  });
  films.forEach((film) => {
    genresStatistic.forEach((item) => {
      if (film.genres.includes(item.genreName)) {
        item.count = item.count + 1;
      }
    });
  });

  return genresStatistic.sort((a, b) => b.count - a.count);
};

const filterMarkupTemplate = (FilterType, currentFilter) => {
  return Object.values(FilterType).map((filter) => {
    const filterName = filter.toLowerCase();
    return (
      `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${filterName}" value="${filterName}" ${currentFilter === filterName ? `checked` : ``}>
      <label for="statistic-${filterName}" class="statistic__filters-label">${filter}</label>`
    );
  }).join(`\n`);
};

const createStatisticsTemplate = (films, currentFilter, filmsCount) => {

  const filmsDuration = films.reduce(function (sum, current) {
    return sum + current.durationMinutes;
  }, 0);
  const topGenre = films.length ? getCountFilmsByGenre(films)[0].genreName : ``;

  return (
    `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${getProfileRating(filmsCount)}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      ${filterMarkupTemplate(StatisticFilterType, currentFilter)}
    </form>
    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${films.length}<span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${getHoursDuration(filmsDuration)}<span class="statistic__item-description">h</span>${getMinutesDuration(filmsDuration)}<span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`
  );
};

export default class Statistic extends AbstractSmartComponent {
  constructor(filmsModel) {
    super();

    this._filmsModel = filmsModel;
    this._films = this._filmsModel.getFilms().filter((film) => film.isWatched);
    this._filmsCount = this._films.length;
    this._filteredFilms = this._films.slice();
    this._currentFilter = StatisticFilterType.ALL;
    this._chart = null;
    this._chartData = getCountFilmsByGenre(this._films);
    this._renderChart();
    this._getChoosedFilterType();
  }

  getTemplate() {
    return createStatisticsTemplate(this._filteredFilms, this._currentFilter, this._filmsCount);
  }

  recoveryListeners() {
    this._getChoosedFilterType();
  }

  rerender() {
    this._filteredFilms = this._getFilteredFilms();
    this._chartData = getCountFilmsByGenre(this._filteredFilms);
    super.rerender();
    this._renderChart();
  }

  _getFilteredFilms() {
    const filter = this._currentFilter;

    if (filter === StatisticFilterType.ALL) {
      return this._films;
    }
    return this._films.filter((film) => {
      const watchingDate = moment(film.watchingDate);
      const currentDate = moment(new Date());
      const filterPeriod = FilterPeriod[filter];
      const dateDifference = currentDate.diff(watchingDate, filterPeriod);
      return dateDifference < FILTER_PERIOD_DIFFERENCE;
    });
  }

  _getChoosedFilterType() {
    this._element.querySelector(`.statistic__filters`).addEventListener(`click`, (evt) => {
      const filterType = evt.target.id;

      if (filterType) {
        this._currentFilter = getFilterNameById(FILTER_ID_PREFIX, filterType);
        this.rerender();
      }
    });
  }

  _renderChart() {
    const element = this.getElement();

    const chartCtx = element.querySelector(`.statistic__chart`);
    chartCtx.height = BAR_HEIGHT * this._chartData.length;
    this._chart = new Chart(chartCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._chartData.map((it) => it.genreName),
        datasets: [{
          data: this._chartData.map((it) => it.count),
          backgroundColor: `#ffe800`,
          hoverBackgroundColor: `#ffe800`,
          anchor: `start`,
          barThickness: 24
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 20
            },
            color: `#ffffff`,
            anchor: `start`,
            align: `start`,
            offset: 40,
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#ffffff`,
              padding: 100,
              fontSize: 20
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    });
  }

}
