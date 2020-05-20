import API from "./api/index.js";
import {AUTHORIZATION, END_POINT, MENU_ITEM_STATS, STORE_VER} from "./const.js";
import CommentsModel from "./models/comments.js";
import FilmBlockComponent from "./components/film-block.js";
import FilmBlockController from "./controllers/film-block.js";
import FilmsModel from "./models/films.js";
import FilterController from "./controllers/filter.js";
import {getWatchStats} from "./utils/stats.js";
import {getStoreName} from "./utils/common.js";
import ProfileComponent from "./components/profile.js";
import Provider from "./api/provider.js";
import {render, remove} from "./utils/render.js";
import SiteMenuComponent from "./components/site-menu.js";
import StatsComponent from "./components/stats.js";
import StatisticsComponent from "./components/statistics.js";
import Store from "./api/store.js";

const api = new API(END_POINT, AUTHORIZATION);
const filmStore = new Store(getStoreName(`film`, STORE_VER), window.localStorage);
const commentStore = new Store(getStoreName(`comment`, STORE_VER), window.localStorage);
const apiWithProvider = new Provider(api, filmStore, commentStore);

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

const footerStatisticElement = document.querySelector(`.footer__statistics`);
const headerElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

const siteMenuComponent = new SiteMenuComponent();
const filmBlockComponent = new FilmBlockComponent();
const filmBlockController = new FilmBlockController(filmBlockComponent.getElement(), filmsModel, commentsModel, apiWithProvider);
const filterController = new FilterController(siteMenuComponent.getElement(), filmsModel);
let statisticsComponent = new StatisticsComponent(filmsModel);

render(siteMainElement, siteMenuComponent);
filterController.render();

render(siteMainElement, statisticsComponent);
statisticsComponent.hide();
render(siteMainElement, filmBlockComponent);

filmBlockController.renderLoadingMessage();

siteMenuComponent.changeMenuItem((menuItem) => {
  if (menuItem === MENU_ITEM_STATS) {
    filmBlockComponent.hide();
    if (statisticsComponent) {
      remove(statisticsComponent);
      statisticsComponent = new StatisticsComponent(filmsModel);
      render(siteMainElement, statisticsComponent);
    }
  } else {
    statisticsComponent.hide();
    filmBlockComponent.show();
  }
});

apiWithProvider.getFilms()
  .then((films) => {
    filmsModel.setFilms(films);
    return Promise.all(films.map((film) => apiWithProvider.getComments(film.id)));
  })
  .then((comments) => {
    const films = filmsModel.getFilms();
    for (let i = 0; i < films.length; i++) {
      commentsModel.setComments(films[i].id, comments[i]);
    }
  })
  .catch(() => {
    filmsModel.setFilms([]);
  })
  .finally(() => {
    const films = filmsModel.getFilms();
    const watchStats = getWatchStats(films);
    filmBlockController.removeLoadingMessage();
    render(headerElement, new ProfileComponent(watchStats));
    filmBlockController.render(films);
    render(footerStatisticElement, new StatsComponent(films.length));
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      // Действие в случае успешной регистрации ServiceWorker
    }).catch(() => {
      // Действие в случае ошибки при регистрации ServiceWorker
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
