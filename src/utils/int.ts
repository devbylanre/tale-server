import crypto from 'crypto';

const int = {
  random: (length: number = 6) => {
    let code = '';

    for (let i = 1; i <= length; i++) {
      const int = crypto.randomInt(1, 9);
      code += int;
    }

    return Number(code);
  },
};

export default int;
