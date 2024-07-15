const postTypeDefs = `#graphql
    type Post {
        _id: ID!
        title: String!
        image: Upload!
        excerpt: String!
        content: String!
        author: User
        category: Category
        createdAt: Float!
        comments: [Comment]
    }

    type Query {
        posts: [Post!]
        post(id: ID!): Post!
    }

    input CreatePostPayload {
        title: String!
        image: ID!
        excerpt: String!
        content: String!
        category: ID!
        author: ID!
    }

    input UpdatePostPayload {
        title: String
        image: ID
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
