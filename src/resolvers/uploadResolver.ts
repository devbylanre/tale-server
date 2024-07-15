import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import Uploads, { Upload } from '../models/upload';
import firebaseApp from '../config/firebase';
import { User } from '../models/user';
import { Request } from 'express';
import crypto from 'crypto';
import path from 'path';
import { Ext, isSupported } from '../utils/file';
import { checkUserRole } from '../utils/role';

const storage = getStorage(firebaseApp, process.env.FIREBASE_STORAGE_BUCKET);

const uploadResolver = {
  Query: {
    uploads: checkUserRole(['admin', 'developer'])(async () => {
      const uploads = await Uploads.find();

      if (uploads.length === 0) {
        throw new Error('No uploads found');
      }

      return uploads;
    }),
    upload: async (_: unknown, args: { id: Upload['_id'] }) => {
      const upload = await Uploads.findById(args.id);
      if (upload === null) {
        throw new Error('Upload not found');
      }
      return upload;
    },
  },

  Mutation: {
    createUpload: async (args: { id: User['_id'] }, context: any) => {
      const files: Express.Multer.File | undefined = context.files;
      const query: Request['query'] = context.query;
      const exts = query.exts as Ext[];

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
            user: args.id,
            uri: URI,
          };
        })
      );

      const records = uploads.map((upload) => new Uploads(upload));
      await Promise.all(records.map((record) => record.save()));

      return records;
    },

    deleteUpload: async (_: unknown, args: { id: Upload['_id'] }) => {
      const upload = await Uploads.findById(args.id);

      if (upload === null) {
        throw new Error('No uploaded file found');
      }

      const fileRef = ref(storage, upload.path);

      await deleteObject(fileRef);
      const deletedRecord = await Uploads.findByIdAndDelete(args.id, {
        new: true,
      });

      return deletedRecord;
    },
  },
};

export default uploadResolver;
