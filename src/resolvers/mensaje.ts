import { ObjectId } from "mongo";
import { createJWT, verifyJWT } from "../libs/jwt.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { Mensaje, User } from "../types.ts";
import { MensajeSchema, UserSchema } from "../db/schema.ts";
import { UsersCollection } from "../db/db.ts";


const MensajeResolver = {
    id : (parent : MensajeSchema) =>{
        return parent._id.toString()
    },
    emisor : (parent : MensajeSchema) => {
        try {
            const user = UsersCollection.findOne({_id : parent.emisor})
            return user
        } catch (error) {
            throw new Error(error)
        }
    },
    destinatario : (parent : MensajeSchema) => {
        try {
            const user = UsersCollection.findOne({_id : parent.destinatario})
            return user
        } catch (error) {
            throw new Error(error)
        }
    }
}

export default MensajeResolver