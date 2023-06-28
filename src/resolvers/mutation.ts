import { ObjectId } from "mongo";
import {  MensajeCollection, UsersCollection} from "../db/db.ts";
import { MensajeSchema, UserSchema } from "../db/schema.ts";
import { Mensaje, User } from "../types.ts";
import { createJWT, verifyJWT } from "../libs/jwt.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

export const Mutation = {
  register: async (
    _: unknown,
    args: {
      username: string;
      password: string;
    },
    context: { idioma : string } 
  ): Promise<UserSchema & { token : String}> => {
    try {

      const i = context.idioma

      console.log(i)
      if(!i){
        throw new Error("idioma invalido");
      }

      const DATE = new Date()

      const user: UserSchema | undefined = await UsersCollection.findOne({
        username: args.username,
      });
      if (user) {
        throw new Error("User already exists");
      }
      const hashedPassword = await bcrypt.hash(args.password);
      const _id = new ObjectId();
      const token = await createJWT(
        {
          username: args.username,
          id: _id.toString(),
          idioma : i,
          fecha : DATE,
          mensajesenv : [],
          mensajesrec : [],
        },
        Deno.env.get("JWT_SECRET")!
      );
      const newUser: UserSchema = {
        _id,
        username: args.username,
        password: hashedPassword,
        idioma : i,
        fecha : DATE,
      };
      await UsersCollection.insertOne(newUser);
      return {
        ...newUser,
        token,
      };
    } catch (e) {
      throw new Error(e);
    }
  },
  login: async (
    _: unknown,
    args: {
      username: string;
      password: string;
    }
  ): Promise<string> => {
    try {
      const user: UserSchema | undefined = await UsersCollection.findOne({
        username: args.username,
      });
      if (!user) {
        throw new Error("User does not exist");
      }
      const pass = user.password as string
      const validPassword = await bcrypt.compare(args.password, pass);
      if (!validPassword) {
        throw new Error("Invalid password");
      }
      const token = await createJWT(
        {
          username: user.username,
          id: user._id.toString(),
          idioma : user.idioma,
          fecha : user.fecha,
          mensajesenv : [],
          mensajesrec : [],
        },
        Deno.env.get("JWT_SECRET")!
      );
      return token;
    } catch (e) {
      throw new Error(e);
    }
  },
  deleteUser : async (_: unknown, 
    args: {password: string},  context: { Auth : string } ) : Promise<UserSchema | undefined> =>{
    try {

      const  token  = context.Auth
      if(!token){
        throw new Error("no token!?")
      }
      const user: User = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET")!
      )) as User;

      if(user.id === undefined){
        throw new Error("token invalido")
      }

      const USER: UserSchema | undefined = await UsersCollection.findOne({
        username: user.username,
      });

      const pass = USER?.password as string
      const validPassword = await bcrypt.compare(args.password, pass);

      if (!validPassword) {
        throw new Error("contraseña incorrecta");
      }

      await UsersCollection.deleteOne({_id : new ObjectId(user.id)})

      return USER

    } catch (error) {
      throw new Error(error)
    }
  },
  sendMessage :  async(_: unknown  , args : {destinatario : string , mensaje : string} , context: { Auth : string , Lang : string }) => {
    try {
      const  token  = context.Auth
      const i  = context.Lang
      if(!token){
        throw new Error("no token!?")
      }

      const user: User = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET")!
      )) as User;

      if(user.id === undefined){
        throw new Error("token invalido")
      }

      const des = await UsersCollection.findOne({username : args.destinatario})

      if(!des){
        throw new Error("destinatario invalido")
      }


      if(des.idioma !== i){
        throw new Error("no hablan el mismo lenguaje")
      }

      const mensaje : MensajeSchema = {
        _id : new ObjectId(),
        idioma : i,
        body : args.mensaje,
        emisor : new ObjectId(user.id),
        destinatario : des._id,
        date : new Date()
      }

      await MensajeCollection.insertOne(mensaje)

      return mensaje

    } catch (error) {
      throw new Error(error)
    }
  }
};
