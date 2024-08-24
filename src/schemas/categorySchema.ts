import { GraphQLObjectType } from 'graphql';

const categoryTypeDefs = `#graphql 
    type Category {
        _id: ID!
        title: String!
        icons: String!
        description: String!
        posts: [Post]
    }

    type Query {
        categories: [Category!]
        category(id: ID!): Category!
    }

    input CreateCategoryPayload {
        title: String!
        icon: String!
        description: String!
    }

    input UpdateCategoryPayload {
        title: String
        icon: String
        description: String
    }

    type Mutation {
        createCategory(payload: CreateCategoryPayload!): Category!
        updateCategory(id: ID!, payload: UpdateCategoryPayload!): Category!
        deleteCategory(id: ID!): Category!
    }
`;

export default categoryTypeDefs;
