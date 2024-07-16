import { NextFunction, Request, Response, Router } from 'express';
import { multiple } from '../controllers/uploadController';
import { upload } from '../middleware/multerMiddleware';
import tokenize from '../utils/token';
import { User } from '../models/user';

const uploadRoutes = Router();

uploadRoutes.post(
  '/:id',
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        throw new Error('Invalid authorization token');
      }

      const user = tokenize.verify(token, process.env.ACCESS_TOKEN as string);

      const ROLES: readonly User['role'][] = ['admin', 'author', 'developer'];

      if (!ROLES.includes((user as User).role)) {
        throw new Error('Unauthorized access');
      }

      next();
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },
  upload.array('files'),
  multiple
);

export default uploadRoutes;
