const userTypeDefs = `#graphql 
    type User {
        _id: ID!
        role: String
        status: String
        email: String!
        password: String!
        firstName: String!
        lastName: String!
    }
    type Query {
        users: [User]
        user(userId: String!): User
    }
    
    input UpdateUserInput {
        firstName: String
        lastName: String
    }
    type Mutation {
        updateUser(userId: String!, data: UpdateUserInput): User
        deleteUser(userId: String!): User
    }
`;

export default userTypeDefs;
