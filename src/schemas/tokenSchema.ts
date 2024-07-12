const tokenTypeDefs = `#graphql
    type Token {
        _id: ID!
        user: ID!
        code: Int!
        expiresAt: Float!
    }

    type Query {
        tokens: [Token!]
        token(id: ID!): Token!
    }

    input VerifyPayload {
        code: Int!
    }

    type Mutation {
        new(email: String!): Token!
        verify(email: String!, payload: VerifyPayload!): Token!
    }
`;

export default tokenTypeDefs;
