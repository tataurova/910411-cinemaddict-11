export const getWatchStats = (films) => films.reduce((stats, film) => {
  if (film.isInWatchlist) {
    stats.watchlist += 1;
  }
  if (film.isWatched) {
    stats.history += 1;
  }
  if (film.isFavorite) {
    stats.favorites += 1;
  }
  return stats;
}, {watchlist: 0, history: 0, favorites: 0});
