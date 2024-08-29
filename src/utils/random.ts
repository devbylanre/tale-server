import crypto from 'crypto';

const random = {
  hex: (length: number) => {
    const number = crypto.randomBytes(length).toString('hex');
    return number;
  },

  ints: (length: number | undefined = 6) => {
    let string = '';
    let i = 0;

    while (i < length) {
      const int = crypto.randomInt(1, 9);
      string += int;
      i += 1;
    }

    return string;
  },
};

export default random;
