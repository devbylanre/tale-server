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
import postTypeDefs from './schemas/postSchema';
import postResolver from './resolvers/postResolver';

const startServer = async () => {
  await mongooseConfig();

  const app = express();

  app.use(express.json());
  app.use(cors({ origin: 'http://localhost:3000' }));

  const userServer = new ApolloServer({
    typeDefs: userTypeDefs,
    resolvers: userResolver,
  });

  const authServer = new ApolloServer({
    typeDefs: authTypeDefs,
    resolvers: authResolver,
  });

  const postServer = new ApolloServer({
    typeDefs: postTypeDefs,
    resolvers: postResolver,
  });

  const categoryServer = new ApolloServer({
    typeDefs: categoryTypeDefs,
    resolvers: categoryResolver,
  });

  await userServer.start();
  await authServer.start();
  await postServer.start();
  await categoryServer.start();

  app.use('/users/', expressMiddleware(userServer));
  app.use('/auth/', expressMiddleware(authServer));
  app.use('/posts/', expressMiddleware(postServer));
  app.use('/categories/', expressMiddleware(categoryServer));

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log('Server is listening on port: ', PORT);
  });
};

startServer();
