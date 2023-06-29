import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { UsersCollection, librosCollection,  } from "../db/mongo.ts";
import { copyN } from "https://deno.land/std@0.154.0/io/util.ts";
import { User } from "../types.ts";
import { verifyJWT } from "../libs/jwt.ts";
import { Context } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { libroSchema } from "../db/schemas.ts";

type getBooksContext = RouterContext<"/getBooks", Record<string | number, string | undefined>, Record<string, any>>

type getUserContext = RouterContext<"/getUser/:id", {
    id: string;
} & Record<string | number, string | undefined>>

export const getBooks = async (context : getBooksContext) => {
    try {
    const params = getQuery(context, { mergeParams: true });
    const title =  params.title
    const page = parseInt(params.page)

    if(!page){
        context.response.status = 403
        return
    }

    let books : libroSchema[] = []

    if(title){
        books = await librosCollection.find({title : title}).toArray()

    }else{
        books = await librosCollection.find({}).toArray()
    }

    if(!books){
        context.response.status = 403
        return
    }

    const  pn = 10
    let index2 = 0
    let pa = 1

    const M = books.map((m, index)=> {
  /*     console.log("index2 " + index2 + "        ")
      console.log("index " + index + "        ")
      console.log("page " + pa + "        ") */

        if(index2 === pn){
            index2 = 0
            pa = pa + 1 
        }

        index2 = index2 + 1 


        if(pa === page){
          return m
        }

    })

    if(!M){
        context.response.status = 403
        return
    }

    const ME = M.filter((m) => m != null)
    context.response.body = ME



    } catch (error) {
      context.response.body = error
    }
  }

  export const getUser = async (context : getUserContext) => {
    try {
        const id = context.params.id

        const user = await UsersCollection.findOne({_id : new ObjectId(id)})

        if(!user){
            context.response.status = 403
            return
        }

        const books = await Promise.all(user.cart.map(async (b)=> {
            const book = await librosCollection.findOne({_id : b})
            return book
        }))

        context.response.body = {
            id : user._id,
            username : user.username,
            email : user.email,
            createdAt : user.createdAt,
            carts : books
        }


    } catch (error) {
      context.response.body = error
    }
  }