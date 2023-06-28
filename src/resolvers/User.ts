import { ObjectId } from "mongo";
import { createJWT, verifyJWT } from "../libs/jwt.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { User } from "../types.ts";
import { UserSchema } from "../db/schema.ts";
import { MensajeCollection } from "../db/db.ts";


const UserResolver = {
    id : (parent : UserSchema | User) =>{
        const p = parent as UserSchema
        return p._id.toString()
    },
    mensajesenv : async (parent : UserSchema) => {
        try {
            const mensajes = await MensajeCollection.find({emisor : parent._id}).toArray()
            return mensajes
        } catch (error) {
            throw new Error(error)
        }
    },
    
    mensajesrec : async (parent : UserSchema) => {
        try {
            const mensajes = await MensajeCollection.find({destinatario : parent._id}).toArray()
            return mensajes
        } catch (error) {
            throw new Error(error)
        }
    }
}

export default UserResolver