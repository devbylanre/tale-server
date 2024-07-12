const categoryTypeDefs = `#graphql 
    type Category {
        _id: ID!
        title: String!
        image: String!
        description: String!
    }

    type Query {
        categories: [Category!]
        category(id: ID!): Category!
    }

    input CreateCategoryPayload {
        title: String!
        image: String!
        description: String!
    }

    input UpdateCategoryPayload {
        title: String
        image: String
        description: String
    }

    type Mutation {
        createCategory(payload: CreateCategoryPayload!): Category!
        updateCategory(id: ID!, payload: UpdateCategoryPayload!): Category!
        deleteCategory(id: ID!): Category!
    }
`;

export default categoryTypeDefs;
