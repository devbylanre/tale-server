import { GraphQLInt } from 'graphql';

const authTypeDefs = `#graphql 
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
        refreshToken(token: String!): SignIn
        changeEmail(email: String!, payload: ChangeEmailPayload!): User
        changePassword(email:String!, payload: ChangePasswordPayload!): User
    }
`;

export default authTypeDefs;
