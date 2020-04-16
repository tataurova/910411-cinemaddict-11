import {getRandomArrayItem, getRandomIntegerNumber, generateRandomDate} from "./random.js";

const FILM_TITLES = [
  `Ostwind 2`,
  `Red Shoes`,
  `Semper Fi`,
  `Sonic the Hedgehog`,
  `The Call of the Wild`,
];

const FILM_POSTERS = [
  `images/posters/made-for-each-other.png`,
  `images/posters/popeye-meets-sinbad.png`,
  `images/posters/sagebrush-trail.jpg`,
  `images/posters/santa-claus-conquers-the-martians.jpg`,
  `images/posters/the-dance-of-life.jpg`,
  `images/posters/the-great-flamarion.jpg`,
  `images/posters/the-man-with-the-golden-arm.jpg`,
];

const SENTENCES = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`,
];

const GENRES = [
  `Musical`,
  `Western`,
  `Drama`,
  `Comedy`,
  `Cartoon`,
  `Mystery`,
];

const EMOTIONS = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`,
];

const AUTHORS = [
  `Tim Macoveev`,
  `John Doe`,
  `Ivan Ivanov`,
  `Petr Petrov`,
  `Olga Tataurova`,
  `Keks`,
];

const COMMENTS = [
  `Interesting setting and a good cast`,
  `Booooooooooring`,
  `Very very old. Meh`,
  `Almost two hours? Seriously?`,
];

const DIRECTORS = [
  `Dodo Abashidze`,
  `Brad Bird`,
  `Martin Campbell`,
];

const WRITERS = [
  `Billy Wilder`,
  `Ethan Coen`,
  `Robert Towne`,
];

const ACTORS = [
  `Robert De Niro`,
  `Jack Nicholson`,
  `Marlon Brando`,
];

const COUNTRIES = [
  `Russia`,
  `China`,
  `USA`,
  `India`,
];

const AGE_RATINGS = [
  0,
  6,
  12,
  16,
  18,
];

const generateDescription = () => {
  const descriptionSentences = [];
  const maxIndex = getRandomIntegerNumber(1, 5);
  for (let i = 0; i < maxIndex; i++) {
    descriptionSentences.push(getRandomArrayItem(SENTENCES));
  }
  return descriptionSentences.join(` `);
};

const generateGenre = () => {
  const genreItems = [];
  const maxCount = getRandomIntegerNumber(1, GENRES.length);
  for (let i = 0; i < maxCount; i++) {
    genreItems.push(getRandomArrayItem(GENRES));
  }
  return genreItems;
};

const generateComment = () => {
  return {
    text: getRandomArrayItem(COMMENTS),
    emotion: getRandomArrayItem(EMOTIONS),
    author: getRandomArrayItem(AUTHORS),
    date: generateRandomDate(),
  };
};

const generateComments = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateComment);
};

const generateFilm = () => {
  const countComments = getRandomIntegerNumber(0, 5);

  return {
    poster: getRandomArrayItem(FILM_POSTERS),
    title: getRandomArrayItem(FILM_TITLES),
    rating: (Math.random() * 10).toFixed(1),
    durationHours: getRandomIntegerNumber(1, 3),
    durationMinutes: getRandomIntegerNumber(0, 59),
    genres: generateGenre(),
    description: generateDescription(),
    comments: generateComments(countComments),
    director: getRandomArrayItem(DIRECTORS),
    writers: getRandomArrayItem(WRITERS),
    actors: getRandomArrayItem(ACTORS),
    productionDate: generateRandomDate(),
    country: getRandomArrayItem(COUNTRIES),
    ageRating: getRandomArrayItem(AGE_RATINGS),
    isInWatchlist: Math.random() > 0.5,
    isWatched: Math.random() > 0.5,
    isFavorite: Math.random() > 0.5,
  };
};

const generateFilms = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateFilm);
};

export {generateFilms, getRandomIntegerNumber};
