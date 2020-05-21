import ProfileComponent from "../components/profile.js";
import {render, replace} from "../utils/render.js";
import {RenderPosition} from "../const.js";

export default class ProfileController {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;

    this._profileComponent = null;

    this._onDataChange = this._onDataChange.bind(this);

    this._filmsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const oldComponent = this._profileComponent;
    const films = this._filmsModel.getHistoryFilms();
    this._profileComponent = new ProfileComponent(films.length);

    if (oldComponent) {
      replace(this._profileComponent, oldComponent);
    } else {
      render(container, this._profileComponent, RenderPosition.BEFOREEND);
    }
  }

  _onDataChange() {
    this.render();
  }
}
