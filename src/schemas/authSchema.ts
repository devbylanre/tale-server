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
        userId: ID!
        code: Int!
        expiresAt: Float!
    }

    type SignInReturn {
        accessToken: String!
        refreshToken: String!
    }

    type ResetEmailReturnType {
        email: String!
    }

    type ResetPasswordReturnType {
        password: String!
    }

    input SignInInput {
        email: String!
        password: String!
    }

    input SignUpInput {
        email: String!
        password: String!
        firstName: String!
        lastName: String!
        role: String
        status: String
    }

    input ChangePasswordInput {
        userId: String!
        oldPassword: String!
        newPassword: String!
    }

    input ChangeEmailInput {
        userId: String!
        email: String!
    }

    type Mutation {
        signUp(payload: SignUpInput): User
        signIn(payload: SignInInput): SignInReturn
        resetEmail(email: String!): Token
        resetPassword(email: String!): Token
        changePassword(payload: ChangePasswordInput): User
        changeEmail(payload: ChangeEmailInput ): User
    }
`;

export default authTypeDefs;
