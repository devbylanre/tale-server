import { ApolloServer } from '@apollo/server';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import cookie from 'cookie-parser';

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
import mediaRoute from './routes/mediaRoute';
import mediaTypeDefs from './schemas/mediaSchema';
import mediaResolver from './resolvers/mediaResolver';

const startServer = async () => {
  const typeDefs = [
    authTypeDefs,
    userTypeDefs,
    tokenTypeDefs,
    categoryTypeDefs,
    commentTypeDefs,
    postTypeDefs,
    mediaTypeDefs,
  ];

  const resolvers = [
    authResolver,
    userResolver,
    tokenResolver,
    postResolver,
    categoryResolver,
    commentResolver,
    mediaResolver,
  ];

  const app = express();

  app.use(express.json());
  app.use(cookie());
  app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

  await mongooseConfig();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    '/graphql/',
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        return { req, res };
      },
    })
  );

  app.use('/rest/medias', mediaRoute);

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log('Server is listening on port: ', PORT);
  });
};

startServer();
