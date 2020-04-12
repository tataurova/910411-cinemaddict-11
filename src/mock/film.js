import {MONTH_NAMES} from "../const.js";

const FilmTitles = [
  `Ostwind 2`,
  `Red Shoes`,
  `Semper Fi`,
  `Sonic the Hedgehog`,
  `The Call of the Wild`,
];

const FilmPosters = [
  `../images/posters/made-for-each-other.png`,
  `../images/posters/popeye-meets-sinbad.png`,
  `../images/posters/sagebrush-trail.jpg`,
  `../images/posters/santa-claus-conquers-the-martians.jpg`,
  `../images/posters/the-dance-of-life.jpg`,
  `../images/posters/the-great-flamarion.jpg`,
  `../images/posters/the-man-with-the-golden-arm.jpg`,
];

const DescriptionsItems = [
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

const GenreItems = [
  `Musical`,
  `Western`,
  `Drama`,
  `Comedy`,
  `Cartoon`,
  `Mystery`,
];

const EmotionItems = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`,
];

const AuthorItems = [
  `Tim Macoveev`,
  `John Doe`,
  `Ivan Ivanov`,
  `Petr Petrov`,
  `Olga Tataurova`,
  `Keks`,
];

const TextItems = [
  `Interesting setting and a good cast`,
  `Booooooooooring`,
  `Very very old. Meh`,
  `Almost two hours? Seriously?`,
];

const DirectorItems = [
  `Dodo Abashidze`,
  `Brad Bird`,
  `Martin Campbell`,
];

const WritersItems = [
  `Billy Wilder`,
  `Ethan Coen`,
  `Robert Towne`,
];

const ActorsItems = [
  `Robert De Niro`,
  `Jack Nicholson`,
  `Marlon Brando`,
];

const CountryItems = [
  `Russia`,
  `China`,
  `USA`,
  `India`,
];

const ageRatingItems = [`0+`, `6+`, `12+`, `16+`, `18+`];

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const countFilms = getRandomIntegerNumber(10000, 1000000);

const generateDescription = () => {
  let descriptionList = [];
  const maxIndex = getRandomIntegerNumber(1, 5);
  for (let i = 0; i < maxIndex; i++) {
    descriptionList.push(getRandomArrayItem(DescriptionsItems));
  }
  return descriptionList;
};

const generateGenres = () => {
  let genresList = [];
  const maxCount = getRandomIntegerNumber(1, GenreItems.length);
  for (let i = 0; i < maxCount; i++) {
    genresList.push(getRandomArrayItem(GenreItems));
  }
  return genresList;
};

const generateCommentDate = () => {
  const targetDate = new Date();
  const differenceDate = getRandomIntegerNumber(0, 12);
  const differenceHours = getRandomIntegerNumber(0, 24);
  const differenceMinutes = getRandomIntegerNumber(0, 60);
  targetDate.setDate(targetDate.getDate() - differenceDate);
  targetDate.setHours(targetDate.getHours() - differenceHours);
  targetDate.setMinutes(targetDate.getMinutes() - differenceMinutes);
  const generatedDate = `${targetDate.getFullYear()}/${targetDate.getMonth()}/${targetDate.getDay()} ${targetDate.getHours()}:${targetDate.getMinutes()}`;
  return generatedDate;
};

const generateReleaseDate = () => {
  return `${getRandomIntegerNumber(1, 31)} ${getRandomArrayItem(MONTH_NAMES)}`;
};

const generateComment = () => {
  return {
    text: getRandomArrayItem(TextItems),
    emotion: getRandomArrayItem(EmotionItems),
    author: getRandomArrayItem(AuthorItems),
    createDate: generateCommentDate(),
  };
};

const generateComments = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateComment);
};

const generateFilm = () => {
  const countComments = getRandomIntegerNumber(0, 5);
  const year = getRandomIntegerNumber(1895, 2020);

  return {
    poster: getRandomArrayItem(FilmPosters),
    title: getRandomArrayItem(FilmTitles),
    rating: (Math.random() * 10).toFixed(1),
    yearProduction: year,
    duration: `${getRandomIntegerNumber(1, 3)}h ${getRandomIntegerNumber(0, 59)}m`,
    genres: generateGenres(),
    description: generateDescription(),
    comments: generateComments(countComments),
    director: getRandomArrayItem(DirectorItems),
    writers: getRandomArrayItem(WritersItems),
    actors: getRandomArrayItem(ActorsItems),
    dateProduction: `${generateReleaseDate()} ${year}`,
    country: getRandomArrayItem(CountryItems),
    ageRating: getRandomArrayItem(ageRatingItems),
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

export {generateFilms, countFilms, getRandomIntegerNumber};
