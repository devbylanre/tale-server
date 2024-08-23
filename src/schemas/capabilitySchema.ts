const capabilityTypeDefs = `#graphql
    type Capability {
        _id: ID!
        name: String!
        label: String!
        description: String!
    }

    type Query {
        capabilities: [Capability]
        capability: Capability
    }

    input CreateCapabilityPayload {
        name: String!
        label: String!
        description: String!
    }

    input EditCapabilityPayload {
        name: String
        label: String
        description: String
    }

    type Mutation {
        createCapability(payload: CreateCapabilityPayload!): Capability!
        editCapability(id: ID!, payload: EditCapabilityPayload!): Capability!
        deleteCapability(id: ID!): Capability!
    }

`;

export default capabilityTypeDefs;
