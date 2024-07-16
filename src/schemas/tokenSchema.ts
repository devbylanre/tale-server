const tokenTypeDefs = `#graphql
    type Token {
        _id: ID!
        user: User!
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
        generateToken(email: String!): Token!
        verifyToken(email: String!, payload: VerifyPayload!): Token!
    }
`;

export default tokenTypeDefs;
