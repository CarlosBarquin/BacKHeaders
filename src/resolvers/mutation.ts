
import { ObjectId } from "mongo";
import * as bcrypt from "bcrypt";
import identityFunc from "https://deno.land/x/graphql_deno@v15.0.0/lib/jsutils/identityFunc.js";
import { update } from "https://deno.land/x/mongo@v0.31.1/src/collection/commands/update.ts";
import { autorCollection, editorialCollection, librosCollection } from "../db/dbconnection.ts";
import { AutorSchema, EditorialSchema, LibroSchema } from "../db/schema.ts";

export const Mutation = {
    addEditorial : async(_ : unknown , args: {name : string, country : string, web : string}) => {
        try {
            const found = await editorialCollection.findOne({name : args.name})
            if(found){
                throw new Error("ya existe")  
            }
            const edi : EditorialSchema = {
                _id : new ObjectId(),
                name : args.name,
                web : args.web,
                country : args.country
            }

            await editorialCollection.insertOne(edi)

            return edi
        } catch (error) {
            throw new Error(error)
        }
    },
    addAuthor : async(_ : unknown , args: {name : string, Lang: string}) => {
        try {
            const found = await autorCollection.findOne({name : args.name})
            if(found){
                throw new Error("ya existe")  
            }
            const edi : AutorSchema = {
                _id : new ObjectId(),
                name : args.name,
                lang : args.Lang
            }

            await autorCollection.insertOne(edi)

            return edi
        } catch (error) {
            throw new Error(error)
        }
    },
    addBook : async(_ : unknown , args: {title : string, year : number, author : string, presshouse : string}) => {
        try {
            const found = await librosCollection.findOne({title : args.title})
            if(found){
                throw new Error("ya existe")  
            }

            const autor = await autorCollection.findOne({_id : new ObjectId(args.author)})
            if(!autor){
                throw new Error("no existeautor")  
            }

            const editorial = await editorialCollection.findOne({_id : new ObjectId(args.presshouse)})
            if(!editorial){
                throw new Error("no existe ediorial")  
            }

            const edi : LibroSchema = {
                _id : new ObjectId(),
                title : args.title,
                editorial : new ObjectId(args.presshouse),
                autor : new ObjectId(args.author),
                year :  args.year
            }
            await librosCollection.insertOne(edi)

            return edi
        } catch (error) {
            throw new Error(error)
        }
    },
  
    deleteBook : async (_  : unknown, args : {id: string}) => {
        try {
            const book = await librosCollection.findOne({_id :  new ObjectId(args.id)})
            if(!book) {
                throw new Error("no exite")
            }
            await librosCollection.deleteOne({_id : new ObjectId(args.id)})

            return book
        } catch (error) {
            throw new Error(error)
        }
    },
    deleteAuthor : async (_  : unknown, args : {id: string}) => {
        try {
            const autor = await autorCollection.findOne({_id :  new ObjectId(args.id)})
            if(!autor) {
                throw new Error("no exite")
            }

            const books = await librosCollection.find({autor : new ObjectId(args.id)}).toArray()
            if(books.length !== 0){
                await librosCollection.delete({autor : new ObjectId(args.id)})
            }
            await autorCollection.deleteOne({_id : new ObjectId(args.id)})

            return autor
        } catch (error) {
            throw new Error(error)
        }
    },
    deletePresshouse : async (_  : unknown, args : {id: string}) => {
        try {
            const editorial = await editorialCollection.findOne({_id :  new ObjectId(args.id)})
            if(!editorial) {
                throw new Error("no exite")
            }

            const books = await librosCollection.find({editorial : new ObjectId(args.id)}).toArray()
            if(books.length !== 0){
                await librosCollection.delete({editorial : new ObjectId(args.id)})
            }

            await editorialCollection.deleteOne({_id : new ObjectId(args.id)})

            return editorial
        } catch (error) {
            throw new Error(error)
        }
    },
    
}
