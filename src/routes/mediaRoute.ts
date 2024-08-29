import { NextFunction, Request, Response, Router } from 'express';
import { multiple } from '../controllers/mediaController';
import { upload } from '../middlewares/multerMiddleware';
import tokenize from '../utils/token';
import Users from '../models/user';
import Roles from '../models/role';
import { Capability } from '../models/capability';

const mediaRoute = Router();

mediaRoute.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        throw new Error('Authorization token is missing');
      }

      const user = tokenize.verify(token, process.env.ACCESS_TOKEN as string);

      if (!user) {
        throw new Error('Invalid authorization token');
      }

      req.user = user;

      const userDocument = await Users.findOne({ _id: user.id });

      if (!userDocument) {
        throw new Error('We are unable to find user account');
      }

      const userRole = await Roles.findOne({ _id: userDocument.role }).populate(
        'capabilities'
      );

      if (!userRole) {
        throw new Error('User role could not be found');
      }

      const CAPABILITY = 'canCreateMedias';
      const userCapabilities = userRole.capabilities as unknown as Capability[];

      const isUserCapable = userCapabilities.some(
        (capability) => capability.name === CAPABILITY
      );

      if (!isUserCapable) {
        throw new Error(
          'Access revoked: You cannot access the resource ' + userRole.name
        );
      }

      next();
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },
  upload.array('files'),
  multiple
);

export default mediaRoute;
