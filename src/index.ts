import { ApolloServer } from '@apollo/server';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { expressMiddleware } from '@apollo/server/express4';
import { GraphQLError } from 'graphql';

dotenv.config();

import mongooseConfig from './config/mongoose';
import userResolver from './resolvers/userResolver';
import authResolver from './resolvers/authResolver';
import categoryResolver from './resolvers/categoryResolver';
import userTypeDefs from './schemas/userSchema';
import authTypeDefs from './schemas/authSchema';
import categoryTypeDefs from './schemas/categorySchema';
import postTypeDefs from './schemas/postSchema';
import postResolver from './resolvers/postResolver';
import commentTypeDefs from './schemas/commentSchema';
import commentResolver from './resolvers/commentResolver';
import tokenTypeDefs from './schemas/tokenSchema';
import tokenResolver from './resolvers/tokenResolver';
import uploadRoutes from './routes/uploadRoutes';
import uploadTypeDefs from './schemas/uploadSchema';
import uploadResolver from './resolvers/uploadResolver';
import { upload } from './middleware/multerMiddleware';

const startServer = async () => {
  const typeDefs = [
    userTypeDefs,
    tokenTypeDefs,
    authTypeDefs,
    categoryTypeDefs,
    commentTypeDefs,
    postTypeDefs,
    uploadTypeDefs,
  ];

  const resolvers = [
    userResolver,
    tokenResolver,
    authResolver,
    postResolver,
    categoryResolver,
    commentResolver,
    uploadResolver,
  ];

  await mongooseConfig();

  const app = express();

  app.use(express.json());
  app.use(cors({ origin: 'http://localhost:3000' }));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use('/', upload.array('files'));

  app.use(
    '/',
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization?.split(' ')[1];
        const files = req.files;
        const query = req.query;
        let user = null;

        if (token) {
          try {
            user = jwt.verify(token, process.env.ACCESS_TOKEN || '');
          } catch (error) {
            console.error('JWT verification error:', error);
            throw new GraphQLError('Invalid or expired token', {
              extensions: { code: 'AUTHORIZATION_ERROR' },
            });
          }
        }

        return { user, files, query };
      },
    })
  );

  app.use('/rest/uploads', uploadRoutes);

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log('Server is listening on port: ', PORT);
  });
};

startServer();
