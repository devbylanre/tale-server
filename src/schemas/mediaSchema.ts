const mediaTypeDefs = `#graphql 
    type Media {
        _id: ID!
        hash: String!
        name: String!
        path: String!
        size: Int!
        uri: String!
        user: User
        alt: String
        createdAt: Float!
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
