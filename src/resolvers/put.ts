import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { UsersCollection, librosCollection,  } from "../db/mongo.ts";
import { UserSchema } from "../db/schemas.ts";
import { copyN } from "https://deno.land/std@0.154.0/io/util.ts";
import { createJWT, verifyJWT } from "../libs/jwt.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { User } from "../types.ts";

type putBookContext = RouterContext<"/updateCart/:idUser/:idBook", {
  idUser: string;
} & {
  idBook: string;
} & Record<string | number, string | undefined>, Record<string, any>>

type loginContext = RouterContext<"/login", Record<string | number, string | undefined>, Record<string, any>>


export const login = async (context : loginContext) => {
    try {
        const params = getQuery(context, { mergeParams: true });
        const username = params.username
        const password = params.password

        if(!username || !password){
            context.response.status = 403
            return
        }

        const user: UserSchema | undefined = await UsersCollection.findOne({
            username: username,
          });
          if (!user) {
            throw new Error("User does not exist");
          }
          const pass = user.password as string
          const validPassword = await bcrypt.compare(password, pass);
          if (!validPassword) {
            throw new Error("Invalid password");
          }
          const token = await createJWT(
            {
              username: user.username,
              email: user.email,
              cart : [],
              createdAt : user.createdAt,
              id: user._id.toString(),
            },
            Deno.env.get("JWT_SECRET")!
          );
          context.response.body = token;
    
           
    } catch (error) {
        context.response.body = error
    }
}

export const updateCart = async (context : putBookContext) => {
  try {
    const idBook = context.params.idBook
    const idUser = context.params.idUser



    const book = await librosCollection.findOne({_id : new ObjectId(idBook)})
    if(!book){
      context.response.body = "nobook"
      return
    }

    
    const user = await UsersCollection.findOne({_id : new ObjectId(idUser)})
    if(!user){
      context.response.body = "nouser"
      return
    }

    const id = new ObjectId(idBook)
    let s = false
    user.cart.map((book) => {
      if(book.toString() === idBook){
        s = true
      }
    })

    if(s){
      context.response.status = 501
      return
    }

    await UsersCollection.updateOne({_id : new ObjectId(idUser)}, {$push : {cart : { $each : [id]}}})
         
    context.response.status = 200
         
  } catch (error) {
      context.response.body = error
  }
}