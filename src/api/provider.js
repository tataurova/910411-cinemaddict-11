import Comment from "../models/comment";
import Film from "../models/film";

const isOnline = () => {
  return window.navigator.onLine;
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, filmStore, commentStore) {
    this._api = api;
    this._filmStore = filmStore;
    this._commentStore = commentStore;
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films.map((film) => film.toRAW()));

          this._filmStore.setItems(items);

          return films;
        });
    }
    const storeFilms = Object.values(this._filmStore.getItems());
    return Promise.resolve(Film.parseFilms(storeFilms));
  }

  getComments(id) {
    if (isOnline()) {
      return this._api.getComments(id)
        .then((comments) => {
          this._commentStore.setItem(id, comments.map((comment) => comment.toRAWforStore()));

          return comments;
        });
    }
    const storeComments = this._commentStore.getItems()[id];
    return Promise.resolve(Comment.parseComments(storeComments, id));
  }

  createComment(film, comment) {
    if (isOnline()) {
      return this._api.createComment(film.id, comment)
        .then((comments) => {
          this._commentStore.setItem(film.id, comments);
          const newFilmComments = film.comments.map((commentItem) => commentItem.id);
          const newFilm = Film.clone(Object.assign(film, {comments: newFilmComments}));
          this._filmStore.setItem(film.id, newFilm);
          return comments;
        });
    }
    return Promise.reject(`You can't create comment in offline`);
  }

  deleteComment(film, comments, commentId) {
    if (isOnline()) {
      return this._api.deleteComment(commentId)
       .then(() => {
         this._commentStore.setItem(film.id, comments);
         this._filmStore.setItem(film.id, film.toRAW());
       });
    }

    return Promise.reject(`You can't create comment in offline`);
  }

  updateFilm(id, film) {
    if (isOnline()) {
      return this._api.updateFilm(id, film)
        .then(() => {
          this._filmStore.setItem(id, film.toRAW());

          return film;
        });
    }
    const localFilm = Film.clone(Object.assign(film, {id}));

    this._filmStore.setItem(id, localFilm.toRAW());

    return Promise.resolve(localFilm);
  }

  sync() {
    if (isOnline()) {
      const storeFilms = Object.values(this._filmStore.getItems());

      return this._api.sync(storeFilms)
        .then((response) => {
          const updatedFilms = response.updated;
          const items = createStoreStructure(updatedFilms);

          this._filmStore.setItems(items);
        });


    }
    return Promise.reject(new Error(`Sync data failed`));
  }

}
