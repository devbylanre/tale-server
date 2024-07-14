import { Request, Response } from 'express';
import path from 'path';
import crypto from 'crypto';
import { ref, getStorage, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebaseApp from '../config/firebase';
import Uploads from '../models/upload';
import { Ext, isSupported } from '../utils/file';

const storage = getStorage(firebaseApp, process.env.FIREBASE_STORAGE_BUCKET);

const multiple = async ({ files, query, params }: Request, res: Response) => {
  const exts = query.exts as Ext[];
  const { id } = params;

  try {
    if (!files || !Array.isArray(files)) {
      throw new Error('No files selected');
    }

    const uploads = await Promise.all(
      files.map(async (file) => {
        const fileName = crypto.randomBytes(16).toString('hex');
        const filePath = path.extname(file.originalname);
        const fileRef = ref(storage, `uploads/${fileName}${filePath}`);

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
          path: metadata.fullPath,
          name: metadata.name,
          size: metadata.size,
          user: id,
          uri: URI,
        };
      })
    );

    const records = uploads.map((upload) => new Uploads(upload));
    await Promise.all(records.map((record) => record.save()));

    return res.status(200).json({ uploads: records });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export { multiple };
