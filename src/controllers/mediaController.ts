import { Request, Response } from 'express';
import path from 'path';
import crypto from 'crypto';
import { ref, getStorage, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebaseApp from '../config/firebase';
import Medias from '../models/media';
import { Ext, isSupported } from '../utils/file';

const storage = getStorage(firebaseApp, process.env.FIREBASE_STORAGE_BUCKET);

const multiple = async ({ files, user, query }: Request, res: Response) => {
  const exts = query.exts as Ext[];

  try {
    if (!files || !Array.isArray(files)) {
      throw new Error('No files selected');
    }

    const medias = await Promise.all(
      files.map(async (file) => {
        const fileId = crypto.randomBytes(16).toString('hex');
        const filePath = path.extname(file.originalname);
        const fileName = path.basename(file.originalname).split('.')[0];
        const fileRef = ref(storage, `uploads/${fileId}${filePath}`);

        if (exts && exts.length > 0) {
          const isValid = isSupported(file.originalname, exts);

          if (!isValid) {
            throw new Error(
              `Unsupported file format ${filePath}. Files allowed are: ${exts}`
            );
          }
        }

        const { metadata } = await uploadBytes(fileRef, file.buffer);
        const URI = await getDownloadURL(fileRef);

        return {
          hash: fileId,
          name: fileName,
          path: metadata.fullPath,
          size: metadata.size,
          user: user.id,
          uri: URI,
        };
      })
    );

    const records = medias.map((media) => new Medias(media));
    await Promise.all(records.map((record) => record.save()));

    return res.status(200).json({ medias: records });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export { multiple };
