import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { User, autor, libro } from "../types.ts";


export type UserSchema = Omit<User, "id" | "token" | "cart"> & {
    _id : ObjectId
    cart : ObjectId[]
}

export type autorSchema = Omit<autor, "books">  & {
    _id : ObjectId
    books : ObjectId[]
}

export type libroSchema = Omit<libro, "id" | "autor" | "carts"> & {
    _id : ObjectId
}
 
