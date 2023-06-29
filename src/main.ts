import { Server } from "std/http/server.ts";
import { GraphQLHTTP } from "gql";
import { makeExecutableSchema } from "graphql_tools";

import { typeDefs } from "./schema.ts";
import { Mutation } from "./resolvers/mutation.ts";
import { Query } from "./resolvers/query.ts";
import bookResolver from "./resolvers/Book.ts";
import autorResolver from "./resolvers/autor.ts";
import editorialResolver from "./resolvers/editoral.ts";

const resolvers = {
  Query,
  Mutation,
  Book : bookResolver,
  Author : autorResolver,
  PressHouse : editorialResolver
};

const p = Deno.env.get("PORT") as string

const s = new Server({
  handler: async (req) => {
    const { pathname } = new URL(req.url);

    return pathname === "/graphql"
      ? await GraphQLHTTP<Request>({
          schema: makeExecutableSchema({ resolvers, typeDefs }),
          graphiql: true,
        })(req)
      : new Response("Not Found", { status: 404 });
  },
  port: parseInt(p),
});

s.listenAndServe();

console.log(`Server running on: http://localhost:3000/graphql`);