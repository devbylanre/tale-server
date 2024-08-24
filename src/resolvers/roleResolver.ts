import Roles, { Role } from '../models/role';

const roleResolver = {
  Query: {
    roles: async () => {
      const roles = await Roles.find();

      if (!roles || roles.length === 0) {
        throw new Error('No roles found');
      }

      return roles;
    },
    role: async (_: unknown, args: { id: Role['_id'] }) => {
      const role = await Roles.findById(args.id);

      if (!role) {
        throw new Error('Could not find role');
      }

      return role;
    },
  },

  Role: {
    capabilities: async (parent: Role) => {
      const capabilities = await Roles.find({
        _id: { $in: parent.capabilities },
      });

      return capabilities;
    },
  },

  Mutation: {
    createRole: async (_: unknown, args: { payload: Omit<Role, '_id'> }) => {
      const role = new Roles(args.payload);
      await role.save();

      return role;
    },

    editRole: async (
      _: unknown,
      args: { id: Role['_id']; payload: Partial<Omit<Role, '_id'>> }
    ) => {
      const newRole = await Roles.findByIdAndUpdate(args.id, args.payload, {
        new: true,
      });

      return newRole;
    },

    deleteRole: async (_: unknown, args: { id: Role['_id'] }) => {
      const role = await Roles.findByIdAndDelete(args.id);

      return role;
    },
  },
};

export default roleResolver;
