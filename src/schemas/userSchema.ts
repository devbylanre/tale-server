const userTypeDefs = `#graphql 
    type User {
        _id: ID!
        role: String
        status: String
        email: String!
        password: String!
        firstName: String!
        lastName: String!
        image: Upload
        posts: [Post]
        uploads: [Upload]
        comments: [Comment]
    }
    type Query {
        users: [User!]
        user(id: ID!): User
    }
    
    input UpdateUserPayload{
        firstName: String
        lastName: String
        image: ID
        role: String
        status: String
    }

    type Mutation {
        updateUser(id: ID!, payload: UpdateUserPayload): User
        deleteUser(id: ID!): User
    }
`;

export default userTypeDefs;
