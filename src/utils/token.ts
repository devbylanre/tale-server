import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';

const tokenize = {
  sign: (type: 'access' | 'refresh', payload: string | object) => {
    switch (type) {
      case 'access':
        return jwt.sign(payload, process.env.ACCESS_TOKEN as string, {
          expiresIn: '1h',
        });
      case 'refresh':
        return jwt.sign(payload, process.env.REFRESH_TOKEN as string, {
          expiresIn: '30d',
        });
    }
  },

  verify: (token: string | undefined, secret: string) => {
    let user = null;
    if (token) {
      try {
        user = jwt.verify(token, secret);
        return user;
      } catch (error) {
        console.error('JWT verification error:', error);
        throw new GraphQLError('Invalid or expired token', {
          extensions: { code: 'AUTHORIZATION_ERROR' },
        });
      }
    }
  },
};

export default tokenize;
