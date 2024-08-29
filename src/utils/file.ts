import path from 'path';

const file = {
  ext: (originalname: Express.Multer.File['originalname']) => {
    const ext = path.extname(originalname);
    return ext;
  },

  type: (mimetype: Express.Multer.File['mimetype']) => {
    const type = mimetype.split('/')[1];
    return type;
  },

  name: (originalname: Express.Multer.File['originalname']) => {
    const name = path.basename(originalname, file.ext(originalname));
    return name;
  },

  isSupported: (
    originalname: Express.Multer.File['originalname'],
    exts: string[]
  ) => {
    const ext = file.ext(originalname).split('.').pop();

    if (!ext) {
      throw new Error('Invalid file. No extension specified');
    }

    const includes = exts.includes(ext);

    if (!includes) {
      throw new Error(`Unsupported file extension: ${ext}`);
    }

    return includes;
  },
};

export default file;
