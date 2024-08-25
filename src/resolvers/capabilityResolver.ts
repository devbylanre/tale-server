import authorization from '../middlewares/authorization';
import Capabilities, { Capability } from '../models/capability';

const capabilityResolver = {
  Query: {
    capabilities: authorization.permit('canReadCapabilities')(async () => {
      const capabilities = await Capabilities.find();

      if (!capabilities || capabilities.length === 0) {
        throw new Error('No capabilities found');
      }

      return capabilities;
    }),
    capability: authorization.permit('canReadCapabilities')(
      async (_: unknown, args: { id: Capability['_id'] }) => {
        const capability = await Capabilities.findById(args.id);

        if (!capability) {
          throw new Error('Cannot find capability');
        }

        return capability;
      }
    ),
  },

  Mutation: {
    createCapability: authorization.permit('canCreateCapabilities')(
      async (_: unknown, args: { payload: Omit<Capability, '_id'> }) => {
        const savedCapability = await Capabilities.findOne({
          name: args.payload.name,
        });

        if (savedCapability) {
          throw new Error('Capability already exists');
        }

        const capability = new Capabilities(args.payload);
        await capability.save();

        return capability;
      }
    ),

    editCapability: authorization.permit('canEditCapabilities')(
      async (
        _: unknown,
        args: {
          id: Capability['_id'];
          payload: Partial<Omit<Capability, '_id'>>;
        }
      ) => {
        const newCapability = await Capabilities.findByIdAndUpdate(
          args.id,
          args.payload,
          { new: true }
        );

        return newCapability;
      }
    ),

    deleteCapability: authorization.permit('canDeleteCapabilities')(
      async (_: unknown, args: { id: Capability['_id'] }) => {
        const capability = await Capabilities.findById(args.id);

        if (!capability) {
          throw new Error('Capability not found');
        }

        await Capabilities.findByIdAndUpdate(args.id);

        return capability;
      }
    ),
  },
};

export default capabilityResolver;
