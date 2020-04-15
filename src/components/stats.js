export const createStatsTemplate = (count) => {
  return (
    `<p>${count} movies inside</p>`.replace(/(\d)(?=(\d{3})+(\D|$))/g, `$1 `)
  );
};
