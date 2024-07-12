import { ApolloServer } from '@apollo/server';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';

dotenv.config();

import mongooseConfig from './config/mongoose';
import userResolver from './resolvers/userResolver';
import authResolver from './resolvers/authResolver';
import categoryResolver from './resolvers/categoryResolver';
import userTypeDefs from './schemas/userSchema';
import authTypeDefs from './schemas/authSchema';
import categoryTypeDefs from './schemas/categorySchema';

const startServer = async () => {
  await mongooseConfig();

  const app = express();

  app.use(express.json());
  app.use(cors({ origin: 'http://localhost:4000' }));

  const server = new ApolloServer({
    typeDefs: [userTypeDefs, authTypeDefs, categoryTypeDefs],
    resolvers: [userResolver, authResolver, categoryResolver],
  });

  await server.start();

  app.use('/', expressMiddleware(server));

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log('Server is listening on port: ', PORT);
  });
};

startServer();
