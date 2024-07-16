import { ApolloServer } from '@apollo/server';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
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
import tokenize from './utils/token';
import cookie from 'cookie-parser';

const startServer = async () => {
  const typeDefs = [
    authTypeDefs,
    userTypeDefs,
    tokenTypeDefs,
    categoryTypeDefs,
    commentTypeDefs,
    postTypeDefs,
    uploadTypeDefs,
  ];

  const resolvers = [
    authResolver,
    userResolver,
    tokenResolver,
    postResolver,
    categoryResolver,
    commentResolver,
    uploadResolver,
  ];

  const app = express();

  app.use(express.json());
  app.use(cookie());
  app.use(cors({ origin: 'http://localhost:3000' }));

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
        console.log({ cookies: req.cookies });
        const token = req.headers.authorization?.split(' ')[1];
        const user = tokenize.verify(token, process.env.ACCESS_TOKEN as string);

        return { user, req, res };
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
