import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { addAutor, addBook, register } from "./resolvers/post.ts";
import { login, updateCart } from "./resolvers/put.ts";
import { deleteAutor, deleteBook, deleteUser } from "./resolvers/delete.ts";
import { getBooks, getUser } from "./resolvers/get.ts";



const router = new Router();

router
.post("/addUser" , register)
.put("/login" , login)
.delete("/deleteUser/:id", deleteUser)
.post("/addAutor" , addAutor)
.post("/addBook", addBook)
.put("/updateCart/:idUser/:idBook", updateCart)
.get("/getBooks", getBooks)
.get("/getUser/:id", getUser)
.delete("/deleteAutor/:id" , deleteAutor)
.delete("/deleteBook/:id", deleteBook )

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

const p = Deno.env.get("PORT") as string

await app.listen({ port: parseInt(p) });
