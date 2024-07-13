import { Router } from 'express';
import { single, multiple, remove } from '../controllers/uploadController';
import { upload } from '../middleware/multerMiddleware';

const uploadRoutes = Router();

uploadRoutes.post('/single/', upload.single('file'), single);
uploadRoutes.post('/multiple/', upload.array('files'), multiple);
uploadRoutes.delete('/delete/:id/', remove);

export default uploadRoutes;
