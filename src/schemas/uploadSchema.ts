const uploadTypeDefs = `#graphql 
    type Upload {
        _id: ID!
        name: String!
        path: String!
        size: Int!
        uri: String!
        user: User
        alt: String
        createdAt: Float!
    }

    type Query {
        upload(id: ID!): Upload
        uploads: [Upload!]
    }

    type Mutation {
        deleteUpload(id: ID!): Upload
    } 
`;

export default uploadTypeDefs;
