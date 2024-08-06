import { deleteObject, getStorage, ref } from 'firebase/storage';
import Medias, { Media } from '../models/media';
import firebaseApp from '../config/firebase';
import authorize from '../middlewares/authorizeMiddleware';
import Users from '../models/user';

const storage = getStorage(firebaseApp, process.env.FIREBASE_STORAGE_BUCKET);

const mediaResolver = {
  Query: {
    medias: authorize.roles(['admin', 'developer', 'reader'])(async () => {
      const medias = await Medias.find();

      if (medias.length === 0) {
        throw new Error('No media found');
      }

      return medias;
    }),
    media: async (_: unknown, args: { id: Media['_id'] }) => {
      const media = await Medias.findById(args.id);
      if (media === null) {
        throw new Error('Media not found');
      }
      return media;
    },
  },

  Media: {
    user: async (parent: Media) => {
      const user = await Users.findOne({ _id: parent.user });
      return user;
    },
  },

  Mutation: {
    deleteMedia: authorize.roles(['admin', 'developer', 'author'])(
      async (_: unknown, args: { id: Media['_id'] }) => {
        const media = await Medias.findById(args.id);

        if (media === null) {
          throw new Error('No uploaded file found');
        }

        const fileRef = ref(storage, media.path);

        await deleteObject(fileRef);
        const deletedRecord = await Medias.findByIdAndDelete(args.id, {
          new: true,
        });

        return deletedRecord;
      }
    ),
    updateMedia: authorize.roles(['admin', 'author', 'developer'])(
      async (
        _: unknown,
        args: { id: Media['_id']; payload: Pick<Media, 'name' | 'alt'> }
      ) => {
        const media = await Medias.findByIdAndUpdate(args.id, args.payload, {
          new: true,
        });

        if (media === null) {
          throw new Error('No media found');
        }

        return media;
      }
    ),
  },
};

export default mediaResolver;
