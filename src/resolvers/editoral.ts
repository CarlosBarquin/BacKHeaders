import { autorCollection, editorialCollection, librosCollection } from "../db/dbconnection.ts"
import { EditorialSchema, LibroSchema } from "../db/schema.ts"



const editorialResolver = {
        books : async (parent : EditorialSchema) => {
            try {
                const books = await librosCollection.find({editorial : parent._id}).toArray()
                return books
            } catch (error) {
                throw new Error(error)
            }
        }

}

export default editorialResolver 