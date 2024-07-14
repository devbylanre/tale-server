const uploadTypeDefs = `#graphql 
    type Upload {
        _id: ID!
        name: String!
        path: String!
        size: Int!
        uri: String!
        user: User
        createdAt: Float!
    }

    type Query {
        upload(id: ID!): Upload
        uploads: [Upload!]
    }

    type Mutation {
        createUpload(id: ID!): Upload
        deleteUpload(id: ID!): Upload
    } 
`;

export default uploadTypeDefs;
