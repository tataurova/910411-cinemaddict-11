export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

export const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

export const generateRandomDate = () => {
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() - getRandomIntegerNumber(0, 12));
  currentDate.setMinutes(currentDate.getMinutes() - getRandomIntegerNumber(0, 1500));
  return currentDate;
};
