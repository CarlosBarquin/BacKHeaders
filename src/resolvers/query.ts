import { ObjectId } from "mongo";
import { verifyJWT } from "../libs/jwt.ts";
import { User } from "../types.ts";
import { MensajeCollection } from "../db/db.ts";
export const Query = {
  Me: async (_: unknown, args: { token: string }) :Promise<User> => {
    try {
      const user: User = (await verifyJWT(
        args.token,
        Deno.env.get("JWT_SECRET")!
      )) as User;
      return user;
    } catch (e) {
      throw new Error(e);
    }
  }, 

  getMessages : async (_ : unknown , args : {page : number, perPage: number }) => {
    try {

      const mensajes = await MensajeCollection.find({}).toArray()

      if(args.page <= 0){
        throw new Error("no paginas negativas")
      }


      if(args.perPage > 200 || args.perPage < 1 ){
        throw new Error("perpagemals")
    }

      if(!mensajes){
        throw new Error("no mensajes")
      }

      const  pn = args.perPage
      let index2 = 0
      let pa = 1

      const M = mensajes.map((m, index)=> {
    /*     console.log("index2 " + index2 + "        ")
        console.log("index " + index + "        ")
        console.log("page " + pa + "        ") */

          if(index2 === pn){
              index2 = 0
              pa = pa + 1 
          }

          index2 = index2 + 1 


          if(pa === args.page){
            return m
          }

      })

      if(!M){
        throw new Error("fdwafrwa")
      }

      const ME = M.filter((m) => m != null)
      return ME
      
    } catch (error) {
      throw new Error(error);
    }
  }

};
