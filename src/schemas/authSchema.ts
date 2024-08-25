import { GraphQLInt } from 'graphql';

const authTypeDefs = `#graphql 

    input SignUpPayload {
        email: String!
        password: String!
        firstName: String
        lastName: String
    }

    type SignIn {
        accessToken: String!
        refreshToken: String!
    }

    input SignInPayload {
        email: String!
        password: String!
    }

    input ChangePasswordPayload {
        email: String!
        password: String!
    }

    input ChangeEmailPayload {
        email: String!
        newEmail: String!
    }

    type Query {
        refreshToken: SignIn
    }

    type Mutation {
        signUp(payload: SignUpPayload!): User
        signIn(payload: SignInPayload!): SignIn
        changeEmail(payload: ChangeEmailPayload!): User
        changePassword(payload: ChangePasswordPayload!): User
    }
`;

export default authTypeDefs;
