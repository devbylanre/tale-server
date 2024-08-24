import Capabilities, { Capability } from '../models/capability';

const capabilityResolver = {
  Query: {
    capabilities: async () => {
      const capabilities = await Capabilities.find();

      if (!capabilities || capabilities.length === 0) {
        throw new Error('No capabilities found');
      }

      return capabilities;
    },
    capability: async (_: unknown, args: { id: Capability['_id'] }) => {
      const capability = await Capabilities.findById(args.id);

      if (!capability) {
        throw new Error('Cannot find capability');
      }

      return capability;
    },
  },

  Mutation: {
    createCapability: async (
      _: unknown,
      args: { payload: Omit<Capability, '_id'> }
    ) => {
      const capability = new Capabilities(args.payload);
      await capability.save();

      return capability;
    },

    editCapability: async (
      _: unknown,
      args: { id: Capability['_id']; payload: Partial<Omit<Capability, '_id'>> }
    ) => {
      const newCapability = await Capabilities.findByIdAndUpdate(
        args.id,
        args.payload,
        { new: true }
      );

      return newCapability;
    },

    deleteCapability: async (_: unknown, args: { id: Capability['_id'] }) => {
      const capability = await Capabilities.findByIdAndDelete(args.id);

      return capability;
    },
  },
};

export default capabilityResolver;
