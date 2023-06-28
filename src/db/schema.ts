
import { ObjectId } from "mongo";
import { Mensaje, User } from "../types.ts";

export type UserSchema = Omit<User, "id" | "token" | "mensajesenv" | "mensajesrec" > & {
  _id : ObjectId,
}


export type MensajeSchema = Omit<Mensaje, "id" | "emisor" | "destinatario" > & {
  _id : ObjectId,
  emisor : ObjectId,
  destinatario: ObjectId
}

