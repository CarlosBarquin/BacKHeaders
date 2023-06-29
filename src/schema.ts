import { gql } from "graphql_tag";

export const typeDefs = gql`

  type Book {
    id : ID!
    title : String!
    author : Author!
    pages : Int!
  }

  type Author {
    name : String!
    books : [Book]!   
  }

  type Query {
    test : String!
    books : [Book]!
    authors : [Author]!
    presshouses : [PressHouse]!
    book(id : ID!) : Book!
    author(id : ID!) : Author!
    presshouse(id : ID!) : PressHouse!

  }

  type Mutation {
      addEditorial(name : String!, web: String!, country : String!) : PressHouse!
      addAuthor(name : String! , Lang: String!) : Author!
      addBook(title : String!, year: Int!, author: ID!, presshouse: ID!) : Book!

      deleteBook(id : ID!) : Book!
      deleteAuthor(id : ID!) : Author!
      deletePresshouse(id : ID!) : PressHouse!
  }
`;
