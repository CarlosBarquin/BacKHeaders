import { Server } from "std/http/server.ts";
import { GraphQLHTTP } from "gql";
import { makeExecutableSchema } from "graphql_tools";

import { Query } from "./resolvers/query.ts";
import { Mutation } from "./resolvers/mutation.ts";
import { typeDefs } from "./schema.ts";
import UserResolver from "./resolvers/User.ts";
import MensajeResolver from "./resolvers/mensaje.ts";

const resolvers = {
  Query,
  Mutation,
  User : UserResolver,
  Mensaje : MensajeResolver
};

const port = Deno.env.get("PORT") as string


const s = new Server({
  handler: async (req) => {
    const { pathname } = new URL(req.url);

    return pathname === "/graphql"
      ? await GraphQLHTTP<Request>({
          schema: makeExecutableSchema({ resolvers, typeDefs }),
          graphiql: true,
          context:(req: { headers: { get: (arg0: string) => any; }; }) => {
            const idioma = req.headers.get("idioma");
            const Auth = req.headers.get("Auth");
            const Lang = req.headers.get("Lang");
            return{
              idioma: idioma,
              Auth: Auth,
              Lang : Lang
            }
          }
        })(req)
      : new Response("Not Found", { status: 404 });
  },
  port: parseInt(port),
});

s.listenAndServe();

console.log(`Server running on: http://localhost:3000/graphql`);
