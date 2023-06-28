import { gql } from "graphql_tag";

export const typeDefs = gql`
  scalar Date
  
  type User {
    id: ID!
    username: String!
    token: String
    idioma : String!
    fecha : Date!
    mensajesenv : [Mensaje!]!
    mensajesrec : [Mensaje!]!
  }

  type Mensaje {
    id : ID!
    idioma : String!
    body : String!
    emisor : User!
    destinatario : User!
  }


  type Query {

    Me(token: String!): User!

    getMessages(page : Int! , perPage : Int!) : [Mensaje]

  }

  type Mutation {
    
    register(
      username: String!
      password: String!
    ): User!
    login(username: String!, password: String!): String!
    deleteUser(password: String! ) : User!

    sendMessage(destinatario : String!, mensaje : String!) : Mensaje!

  }
`;
