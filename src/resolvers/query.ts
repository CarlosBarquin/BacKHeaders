
import { ObjectId } from "mongo";
import { calculateObjectSize } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import { __Directive } from "https://deno.land/x/graphql_deno@v15.0.0/mod.ts";
import { autorCollection, editorialCollection, librosCollection } from "../db/dbconnection.ts";

export const Query = {
    test : () => {
        return "fwafafwaa"
    },
    books : async () =>{
        try {
            const books = await librosCollection.find({}).toArray()
            return books
        } catch (error) {
            throw new Error(error)
        }
    },
    authors : async () =>{
        try {
            const autores = await autorCollection.find({}).toArray()
            return autores
        } catch (error) {
            throw new Error(error)
        }
    },
    presshouses : async () =>{
        try {
            const editorial = await editorialCollection.find({}).toArray()
            return editorial
        } catch (error) {
            throw new Error(error)
        }
    },

    book : async (_  : unknown, args : {id: string}) => {
        try {
            const book = await librosCollection.findOne({_id :  new ObjectId(args.id)})
            if(!book) {
                throw new Error("no exite")
            }
            return book
        } catch (error) {
            throw new Error(error)
        }
    }
    ,
    author : async (_  : unknown, args : {id: string}) => {
        try {
            const autor = await autorCollection.findOne({_id :  new ObjectId(args.id)})
            if(!autor) {
                throw new Error("no exite")
            }
            return autor
        } catch (error) {
            throw new Error(error)
        }
    },
    presshouse : async (_  : unknown, args : {id: string}) => {
        try {
            const editorial = await editorialCollection.findOne({_id :  new ObjectId(args.id)})
            if(!editorial) {
                throw new Error("no exite")
            }
            return editorial
        } catch (error) {
            throw new Error(error)
        }
    }
    
    
    
    
    

    
 };