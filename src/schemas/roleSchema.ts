const roleTypeDefs = `#graphql
    type Role {
        _id: ID!
        name: String!
        capabilities: [Capability!]
    }

    type Query {
        roles: [Role]
        role(id: ID!): Role
    }

    input CreateRolePayload {
        name: String!
        capabilities: [ID!]
    }

    input EditRolePayload {
        name: String
        capabilities: [ID]
    }

    type Mutation {
        createRole(payload: CreateRolePayload!): Role!
        editRole(id: ID!, payload: EditRolePayload!): Role!
        deleteRole(id: ID!): Role!
    }
`;

export default roleTypeDefs;
