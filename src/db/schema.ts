import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import { autor,libro } from "../types.ts";

export type LibroSchema = Omit<libro, "autor" > & {
  _id : ObjectId
}


export type AutorSchema = Omit<autor, "books"> & {
  books : ObjectId[]
  _id : ObjectId
}
