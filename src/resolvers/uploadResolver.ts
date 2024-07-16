import { deleteObject, getStorage, ref } from 'firebase/storage';
import Uploads, { Upload } from '../models/upload';
import firebaseApp from '../config/firebase';
import authorize from '../middleware/authorize';
import Users from '../models/user';

const storage = getStorage(firebaseApp, process.env.FIREBASE_STORAGE_BUCKET);

const uploadResolver = {
  Query: {
    uploads: authorize.roles(['admin', 'developer'])(async () => {
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

  Upload: {
    user: async (parent: Upload) => {
      const user = await Users.findOne({ _id: parent.user });
      return user;
    },
  },

  Mutation: {
    deleteUpload: authorize.roles(['admin', 'developer', 'author'])(
      async (_: unknown, args: { id: Upload['_id'] }) => {
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
      }
    ),
  },
};

export default uploadResolver;
