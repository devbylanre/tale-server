const str = {
  lower: (str: string) => {
    return str.toLowerCase();
  },
  compare: (firstStr: string, secondStr: string) => {
    return str.lower(firstStr) === str.lower(secondStr);
  },
};

export default str;
