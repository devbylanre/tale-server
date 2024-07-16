const date = {
  now: () => Date.now(),
  at: (int: number = 15 * 60000) => {
    const at = new Date(date.now() + int);
    return at;
  },
};

export default date;
