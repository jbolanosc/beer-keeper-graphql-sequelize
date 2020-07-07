const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: Int!
    login: String!
  }
  type Beer {
    id: Int!
    name: String!
    brand: String
    price: Float
  }

  type Query {
    current: User
    beer(name: String!): Beer
    beers(brand: String!): [Beer]
  }

  type Mutation {
    register(login: String!, password: String!): String
    login(login: String!, password: String!): String
    newBeer(brand: String!, name: String!, price: Float!): String
  }
`;

module.exports = typeDefs;
