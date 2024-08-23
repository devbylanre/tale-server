const roleTypeDefs = `#graphql
    type Role {
        _id: ID!
        name: String!
        capabilities: [Capability!]
    }

    type Query {
        roles: [Role]
        role: Role
    }

    input CreateRolePayload {
        name: String!
        capabilities: [Capability!]
    }

    input EditRolePayload {
        name: String
        capabilities: [Capability]
    }

    type Mutation {
        createRole(payload: CreateRolePayload): Role!
        editRole(id: ID!, payload: EditRolePayload): Role!
        deleteRole(id: ID!): Role!
    }
`;

export default roleTypeDefs;
