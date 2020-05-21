export default class Film {
  constructor(data) {
    this.id = data.id;
    this.poster = data.film_info.poster;
    this.title = data.film_info.title;
    this.alternativeTitle = data.film_info.alternative_title;
    this.rating = data.film_info.total_rating;
    this.durationMinutes = data.film_info.runtime;
    this.genres = data.film_info.genre;
    this.description = data.film_info.description;
    this.comments = data.comments;
    this.director = data.film_info.director;
    this.writers = data.film_info.writers;
    this.actors = data.film_info.actors;
    this.productionDate = data.film_info.release.date;
    this.country = data.film_info.release.release_country;
    this.ageRating = data.film_info.age_rating;
    this.isInWatchlist = data.user_details.watchlist;
    this.isWatched = data.user_details.already_watched;
    this.isFavorite = data.user_details.favorite;
    this.watchingDate = data.user_details.watching_date;
  }

  toRAW() {
    return {
      "id": this.id,
      "comments": this.comments,
      "film_info": {
        "title": this.title,
        "alternative_title": this.alternativeTitle,
        "total_rating": this.rating,
        "poster": this.poster,
        "age_rating": this.ageRating,
        "director": this.director,
        "writers": this.writers,
        "actors": this.actors,
        "release": {
          "date": this.productionDate,
          "release_country": this.country,
        },
        "runtime": this.durationMinutes,
        "genre": this.genres,
        "description": this.description,
      },
      "user_details": {
        "watchlist": this.isInWatchlist,
        "already_watched": this.isWatched,
        "watching_date": this.watchingDate,
        "favorite": this.isFavorite,
      },
    };
  }

  static parseFilm(data) {
    return new Film(data);
  }

  static parseFilms(data) {
    return data.map(Film.parseFilm);
  }

  static clone(data) {
    return new Film(data.toRAW());
  }
}
