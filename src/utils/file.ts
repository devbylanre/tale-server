import path from 'path';

export type Ext =
  | 'jpg'
  | 'jpeg'
  | 'png'
  | 'svg'
  | 'gif'
  | 'mp4'
  | 'avi'
  | 'mov'
  | 'mp3';

const isSupported = (
  originalname: Express.Multer.File['originalname'],
  exts: Ext[]
) => {
  const extname = path.extname(originalname).toLowerCase();
  const ext = extname.split('.').pop();
  return exts.includes(ext as Ext);
};

export { isSupported };
