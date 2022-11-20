import express, { json } from "express"
import cors from "cors"
import { deleteUser, getUser, postUser } from "./controllers/userControler.js";
import { signIn, signUp } from "./controllers/authController.js";

const app = express()
app.use(cors())
app.use(json())

app.post("/sign-up", signIn)

app.post("/sign-in", signUp)

app.post("/user", postUser)

app.get("/user", getUser)

app.delete("/user", deleteUser)

app.listen(5000, () => {
    console.log("Rodando em http://localhost:5000");
})