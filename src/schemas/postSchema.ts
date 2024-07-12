const postTypeDefs = `#graphql 
    type Post {
        _id: ID!
        title: String!
        image: String!
        excerpt: String!
        content: String!
        author: ID!
        category: ID!
        createdAt: Float!
    }

    type Query {
        posts: [Post!]
        post(id: ID!): Post!
    }

    input CreatePostPayload {
        title: String!
        image: String!
        excerpt: String!
        content: String!
        category: ID!
        author: ID!
    }

    input UpdatePostPayload {
        title: String
        image: String
        excerpt: String
        content: String
        category: ID
    }

    type Mutation {
        createPost(payload: CreatePostPayload!): Post!
        updatePost(id: ID!, payload: UpdatePostPayload!): Post!
        deletePost(id: ID!): Post!
    }
`;

export default postTypeDefs;
