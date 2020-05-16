import API from "./api.js";
import {CardCount, MENU_ITEM_STATS} from "./const.js";
import CommentsModel from "./models/comments.js";
import FilmBlockComponent from "./components/film-block.js";
import FilmBlockController from "./controllers/film-block.js";
import FilmsModel from "./models/films.js";
import FilterController from "./controllers/filter.js";
import {getWatchStats} from "./utils/stats.js";
import ProfileComponent from "./components/profile.js";
import {render, remove} from "./utils/render.js";
import SiteMenuComponent from "./components/site-menu.js";
import StatsComponent from "./components/stats.js";
import StatisticsComponent from "./components/statistics.js";

const AUTHORIZATION = `Basic DSffsgGFDGDFgsdf&s`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;

const api = new API(END_POINT, AUTHORIZATION);
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

const footerStatisticElement = document.querySelector(`.footer__statistics`);
const headerElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

const siteMenuComponent = new SiteMenuComponent();
const filmBlockComponent = new FilmBlockComponent();
const filmBlockController = new FilmBlockController(filmBlockComponent.getElement(), filmsModel, commentsModel, api);
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

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(films);
     return Promise.all(films.map((film) => api.getComments(film.id)));
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
    filmBlockController.removeLoadingMessage();
    const watchStats = getWatchStats(filmsModel.getFilms());
    render(footerStatisticElement, new StatsComponent(filmsModel.getFilms().length));
    render(headerElement, new ProfileComponent(watchStats));
    filmBlockController.render(filmsModel.getFilms());
  })

