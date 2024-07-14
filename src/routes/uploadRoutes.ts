import { Router } from 'express';
import { multiple } from '../controllers/uploadController';
import { upload } from '../middleware/multerMiddleware';

const uploadRoutes = Router();

uploadRoutes.post('/:id', upload.array('files'), multiple);

export default uploadRoutes;
