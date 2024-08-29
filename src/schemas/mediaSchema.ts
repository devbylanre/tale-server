const mediaTypeDefs = `#graphql 
    type Media {
        _id: ID!
        name: String!
        path: String!
        size: Int!
        uri: String!
        alt: String!
        type: String!
        createdAt: Float!
        uploadedBy: User!
    }

    type Query {
        media(id: ID!): Media
        medias: [Media!]
    }

    input UpdateMediaPayload {
        name: String
        alt: String
    }

    type Mutation {
        deleteMedia(id: ID!): Media
        updateMedia(id: ID!, payload: UpdateMediaPayload!): Media
    } 
`;

export default mediaTypeDefs;
