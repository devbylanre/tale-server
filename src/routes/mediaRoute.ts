import { NextFunction, Request, Response, Router } from 'express';
import { multiple } from '../controllers/mediaController';
import { upload } from '../middlewares/multerMiddleware';
import tokenize from '../utils/token';
import { User } from '../models/user';

const mediaRoute = Router();

mediaRoute.post(
  '/',
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        throw new Error('Invalid authorization token');
      }

      const user = tokenize.verify(token, process.env.ACCESS_TOKEN as string);

      const ROLES: readonly User['role'][] = [
        'admin',
        'author',
        'developer',
        'reader',
      ];

      req.user = user as Record<string, string>;

      if (!ROLES.includes((user as User).role)) {
        throw new Error('Unauthorized access');
      }

      next();
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },
  upload.array('medias'),
  multiple
);

export default mediaRoute;
