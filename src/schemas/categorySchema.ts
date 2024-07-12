const categoryTypeDefs = `#graphql 
    type Category {
        _id: String!
        title: String!
        image: String!
        description: String!
    }

    type Query {
        categories: [Category!]
        category(id: String!): Category!
    }

    input UpdateCategoryPayload {
        title: String
        image: String
        description: String
    }

    type Mutation {
        createCategory(title: String!, image: String!, description: String!): Category!
        deleteCategory(id: String!): Category!
        updateCategory(id: String!, payload: UpdateCategoryPayload): Category!
    }
`;

export default categoryTypeDefs;
