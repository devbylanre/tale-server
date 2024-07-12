const commentTypeDefs = `#graphql 
    type Comment {
        _id: ID
        content: String!
        author: ID!
        post: ID!
        createdAt: Float
    }
    
    type Query {
        comments: [Comment!]
        comment(id: ID!): Comment!
    }

    input CreateCommentPayload {
        content: String!
        author: ID!
        post: ID!
    }

    input UpdateCommentPayload {
        content: String
    }

    type Mutation {
        createComment(payload: CreateCommentPayload!): Comment!
        updateComment(id: ID!, payload: UpdateCommentPayload!): Comment!
        deleteComment(id: ID!): Comment!
    }
`;

export default commentTypeDefs;
