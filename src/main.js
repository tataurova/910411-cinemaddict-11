import ProfileComponent from "./components/profile.js";
import FilterController from "./controllers/filter.js";
import StatsComponent from "./components/stats.js";
import FilmBlockComponent from "./components/film-block.js";
import FilmBlockController from "./controllers/film-block.js";
import {getWatchStats} from "./utils/stats.js";
import {render} from "./utils/render.js";
import {CardCount} from "./const.js";
import FilmsModel from "./models/films.js";
import {generateFilms} from "./mock/film.js";

const headerElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const footerStatisticElement = document.querySelector(`.footer__statistics`);

const films = generateFilms(CardCount.MAIN);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);
const watchStats = getWatchStats(films);

render(headerElement, new ProfileComponent(watchStats));
const filterController = new FilterController(siteMainElement, filmsModel);
filterController.render();
render(footerStatisticElement, new StatsComponent(films.length));

const filmBlockComponent = new FilmBlockComponent();
const filmBlockController = new FilmBlockController(filmBlockComponent.getElement(), filmsModel);

render(siteMainElement, filmBlockComponent);
filmBlockController.render(films);
