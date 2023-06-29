import { autorCollection, editorialCollection } from "../db/dbconnection.ts"
import { LibroSchema } from "../db/schema.ts"



const bookResolver = {
    author : async (parent : LibroSchema) => {
        try {
            const autor = await autorCollection.findOne({_id : parent.autor})
            if(!autor){
                throw new Error("no existe el autor")
            }
            return autor
        } catch (error) {
            throw new Error(error)
        }
    },
    presshouse : async (parent : LibroSchema) => {
        try {
            const presshouse = await editorialCollection.findOne({_id : parent.editorial})
            if(!presshouse){
                throw new Error("no existe el autor")
            }
            return presshouse
        } catch (error) {
            throw new Error(error)
        }
    }

}

export default bookResolver