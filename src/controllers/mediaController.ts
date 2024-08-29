import { Request, Response } from 'express';
import { ref, getStorage, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebaseApp from '../config/firebase';
import Medias, { Media } from '../models/media';
import fileUtil from '../utils/file';
import random from '../utils/random';

const storage = getStorage(firebaseApp, process.env.FIREBASE_STORAGE_BUCKET);

const multiple = async ({ files, user, query }: Request, res: Response) => {
  const exts = query.exts as string[] | undefined;

  try {
    if (!files || !Array.isArray(files)) {
      throw new Error('No files selected');
    }

    const medias = await Promise.all(
      files.map(async (file) => {
        const id = random.hex(16);
        const ext = fileUtil.ext(file.originalname);
        const name = fileUtil.name(file.originalname);
        const type = fileUtil.type(file.mimetype);

        const fileRef = ref(storage, `uploads/${id}${ext}`);

        if (exts && exts.length > 0) {
          fileUtil.isSupported(file.originalname, exts);
        }

        const { metadata } = await uploadBytes(fileRef, file.buffer);
        const uri = await getDownloadURL(fileRef);

        const media: Omit<Media, '_id' | 'createdAt' | 'alt'> = {
          uri: uri,
          name: name,
          type: type,
          uploadedBy: user.id,
          size: metadata.size,
          path: metadata.fullPath,
        };

        return media;
      })
    );

    const documents = medias.map((media) => new Medias(media));
    await Promise.all(documents.map((document) => document.save()));

    return res.status(200).json({ medias: documents });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export { multiple };
