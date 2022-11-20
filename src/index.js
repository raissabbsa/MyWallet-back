import express, { json } from "express"
import cors from "cors"
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js"

const app = express()
app.use(cors())
app.use(json())
app.use(authRouter)
app.use(userRouter)


app.listen(5000, () => {
    console.log("Rodando em http://localhost:5000");
})