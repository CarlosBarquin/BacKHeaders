import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { UsersCollection, autorCollection, librosCollection } from "../db/mongo.ts";
import { UserSchema, autorSchema, libroSchema } from "../db/schemas.ts";
import { createJWT, verifyJWT } from "../libs/jwt.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { User, autor } from "../types.ts";

type addAutorContext = RouterContext<"/addAutor", Record<string | number, string | undefined>, Record<string, any>>

type addBookContext = RouterContext<"/addBook", Record<string | number, string | undefined>, Record<string, any>>

type registerContext = RouterContext<"/addUser", Record<string | number, string | undefined>, Record<string, any>>

export const register = async ( context : registerContext) => {
    try {
        const result = context.request.body({ type: "json" });
        const value = await  result.value 

        if (!value?.username || !value?.email || !value?.password) {
            context.response.status = 400;
           return
        }

        const user: UserSchema | undefined = await UsersCollection.findOne({
            username: value.username,
          });
          if (user) {
            context.response.status= 400
          }

          const date = new Date()
          const hashedPassword = await bcrypt.hash(value.password);
          const _id = new ObjectId();
          const token = await createJWT(
            {
              username: value.username,
              email: value.email,
              id: _id.toString(),
              createdAt : date,
              cart : []
            },
            Deno.env.get("JWT_SECRET")!
          );
          const newUser: UserSchema = {
            _id,
            username: value.username,
            email: value.email,
            password: hashedPassword,
            createdAt : date,
            cart : []
          };
          await UsersCollection.insertOne(newUser);
          context.response.body = {
            ...newUser,
            token,
          };


    
    } catch (error) {
        context.response.body = error
    }
}

export const addAutor = async (context : addAutorContext) => {
  try {

    const result = context.request.body({ type: "json" });
    const value = await  result.value 

    if (!value?.name) {
        context.response.status = 400;
       return
    }

    const found = await autorCollection.findOne({name : value.name})
    if(found){
      context.response.status = 400;
      return
    }

    const autor : autorSchema = {
      _id : new ObjectId(),
      name : value.name,
      books : []
    }

    await autorCollection.insertOne(autor)

    context.response.body = autor

  } catch (error) {
    context.response.body = error
  }
}


export const addBook = async (context : addBookContext) => {
  try {

    const result = context.request.body({ type: "json" });
    const value = await  result.value 

    if (!value?.title || !value?.autor || !value?.pages) {
        context.response.status = 400;
       return
    }

    const found = await librosCollection.findOne({title : value.title})
    if(found){
      context.response.status = 400;
      return
    }

    const id = new ObjectId()

    const autor = await autorCollection.findOne({_id : new ObjectId(value.autor)})
    if(!autor){
      context.response.status = 400;
      return
    }
    await autorCollection.updateOne({_id : new ObjectId(value.autor) }, {$push : {books : {$each : [id]}}})

    const libro : libroSchema = {
      _id : id,
      title : value.title,
      pages : value.pages
    }

    await librosCollection.insertOne(libro)

    context.response.body = {
      _id : id,
      title : value.title,
      pages : value.pages,
      carts : []
    }

  } catch (error) {
    context.response.body = error
  }
}

