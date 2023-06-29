import { autorCollection, editorialCollection, librosCollection } from "../db/dbconnection.ts"
import { AutorSchema, EditorialSchema, LibroSchema } from "../db/schema.ts"



const autorResolver = {
        books : async (parent : AutorSchema) => {
            try {
                const books = await librosCollection.find({autor : parent._id}).toArray()
                return books
            } catch (error) {
                throw new Error(error)
            }
        }

}

export default autorResolver 