import authorization from '../middlewares/authorization';
import Capabilities from '../models/capability';
import Roles, { Role } from '../models/role';

const roleResolver = {
  Query: {
    roles: authorization.permit('canReadRoles')(async () => {
      const roles = await Roles.find();

      if (!roles || roles.length === 0) {
        throw new Error('No roles found');
      }

      return roles;
    }),
    role: authorization.permit('canReadRoles')(
      async (_: unknown, args: { id: Role['_id'] }) => {
        const role = await Roles.findById(args.id);

        if (!role) {
          throw new Error('Could not find role');
        }

        return role;
      }
    ),
  },

  Role: {
    capabilities: async (parent: Role) => {
      const capabilities = await Capabilities.find({
        _id: { $in: parent.capabilities },
      });

      if (!capabilities) {
        throw new Error('No capabilities found');
      }

      return capabilities;
    },
  },

  Mutation: {
    createRole: authorization.permit('canCreateRoles')(
      async (_: unknown, args: { payload: Omit<Role, '_id'> }) => {
        const previousRole = await Roles.findOne({ name: args.payload.name });

        if (previousRole) {
          throw new Error('Role already exists');
        }

        const role = new Roles(args.payload);
        await role.save();

        return role;
      }
    ),

    editRole: authorization.permit('canEditRoles')(
      async (
        _: unknown,
        args: { id: Role['_id']; payload: Partial<Omit<Role, '_id'>> }
      ) => {
        const newRole = await Roles.findByIdAndUpdate(args.id, args.payload, {
          new: true,
        });

        return newRole;
      }
    ),

    deleteRole: authorization.permit('canDeleteRoles')(
      async (_: unknown, args: { id: Role['_id'] }) => {
        const role = await Roles.findByIdAndDelete(args.id);

        return role;
      }
    ),
  },
};

export default roleResolver;
