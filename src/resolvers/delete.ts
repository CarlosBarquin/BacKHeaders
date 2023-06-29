import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { copyN } from "https://deno.land/std@0.154.0/io/util.ts";
import { Context, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { User } from "../types.ts";
import { createJWT, verifyJWT } from "../libs/jwt.ts";
import { UserSchema, autorSchema, libroSchema } from "../db/schemas.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { UsersCollection, autorCollection, librosCollection } from "../db/mongo.ts";


type removeUserContext = RouterContext<"/deleteUser/:id", {
    id: string;
} & Record<string | number, string | undefined>, Record<string, any>>


type removeBookContext = RouterContext<"/deleteBook/:id", {
    id: string;
} & Record<string | number, string | undefined>, Record<string, any>>


type deleteAutorContext = RouterContext<"/deleteAutor/:id", {
    id: string;
} & Record<string | number, string | undefined>, Record<string, any>>

export const deleteUser = async (context : removeUserContext) => {
    try {
        const id = context.params.id
    
          const UserSchema = await UsersCollection.findOne({_id : new ObjectId(id)})

          if(!UserSchema){
            context.response.status = 500
            return
          }
    
          await UsersCollection.deleteOne({_id : new ObjectId(id)})
    
          context.response.body = UserSchema

        
    } catch (error) {
        context.response.body = error
    }
}


export const deleteAutor = async (context : deleteAutorContext) => {
    try {
        const id = context.params.id
    
        const autor = await autorCollection.findOne({_id : new ObjectId(id)})

        if(!autor){
            context.response.body = "caca"
            return
        }

        const books = await Promise.all(autor!.books.map(async (b)=> {
            const book = await librosCollection.findOne({_id : b})
            return book
        })) as libroSchema[]

        console.log(books)

        if(books.length !== 0){
            await Promise.all(autor!.books.map(async (b)=> {
                await librosCollection.deleteOne({_id : b})
         
      }))
        }

        

        await autorCollection.deleteOne(autor)

        context.response.body = {
            id : autor._id,
            name : autor.name,
            books : books
        }

        
        
    } catch (error) {
        context.response.body = error
    }
}



export const deleteBook = async (context : removeBookContext) => {
    try {
        const id = context.params.id
    
       const book = await librosCollection.findOne({_id : new ObjectId(id)})

       if(!book){
        context.response.body= "cac22a"
        return
       }

       const autors = await autorCollection.find({}).toArray()

       const Books = await Promise.all(autors.map(async (a)=>{
          const l =  await Promise.all(a.books.map(async (b)=>{
                return await librosCollection.findOne({_id : new ObjectId(id)})
            }))

            if(l.length !== 0){
                await autorCollection.updateOne({_id : a._id}, {$pull : {books : new ObjectId(id)}})
                return a
            }
       })) as autorSchema[]

       const b = Books.filter((m) => m !== undefined)

      console.log(b)

      const Users = await UsersCollection.find({}).toArray()
      const BooksU = await Promise.all(Users.map(async (a)=>{
        const l =  await Promise.all(a.cart.map(async (b)=>{
              return await librosCollection.findOne({_id : new ObjectId(id)})
          }))

          if(l.length !== 0){
              await UsersCollection.updateOne({_id : a._id}, {$pull : {cart : new ObjectId(id)}})
              return a
          }
     })) as UserSchema[]

     const u = BooksU.filter((m) => m !== undefined)

    console.log(u)

    await librosCollection.deleteOne({_id : new ObjectId(id)})

    console.log(book)

    context.response.status= 200
      
        
    } catch (error) {
        context.response.body = error
    }
}
