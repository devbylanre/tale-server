const roleTypeDefs = `#graphql
    type Role {
        _id: ID!
        name: String!
        description: String!
        capabilities: [Capability]
    }

    type Query {
        roles: [Role]
        role(id: ID!): Role
    }

    input CreateRolePayload {
        name: String!
        description: String!
        capabilities: [ID!]
    }

    input EditRolePayload {
        name: String
        description: String
        capabilities: [ID]
    }

    type Mutation {
        createRole(payload: CreateRolePayload!): Role!
        editRole(id: ID!, payload: EditRolePayload!): Role!
        deleteRole(id: ID!): Role!
    }
`;

export default roleTypeDefs;
