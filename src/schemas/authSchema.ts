import { GraphQLInt } from 'graphql';

const authTypeDefs = `#graphql 
    type User {
        _id: ID!
        role: String
        status: String
        email: String!
        password: String!
        firstName: String!
        lastName: String!
    }
    
    type Token {
        _id: ID!
        user: ID!
        code: Int!
        expiresAt: Float!
    }

    type Query {
        ping: Boolean!
    }

    input SignUpPayload {
        email: String!
        password: String!
        firstName: String!
        lastName: String!
    }

    type SignIn {
        accessToken: String!
        refreshToken: String!
        user: User!
    }

    input SignInPayload {
        email: String!
        password: String!
    }

    input ChangePasswordPayload {
        password: String!
    }

    input ChangeEmailPayload {
        email: String!
    }

    type Mutation {
        signUp(payload: SignUpPayload!): User
        signIn(payload: SignInPayload!): SignIn
        changeEmail(email: String!, payload: ChangeEmailPayload!): User
        changePassword(email:String!, payload: ChangePasswordPayload!): User
    }
`;

export default authTypeDefs;
