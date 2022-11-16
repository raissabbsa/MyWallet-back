import express, { json } from "express"
import cors from "cors"
import dotenv from "dotenv"
import {MongoClient} from "mongodb"
import joi from "joi"
import bcrypt from "bcrypt"
import { v4 as uuidV4 } from "uuid"
dotenv.config()

const app = express()
app.use(cors())
app.use(json())

const mongoCliente = new MongoClient(process.env.MONGO_URI)
let db

try{
    await mongoCliente.connect()
    db = mongoCliente.db("myWallet")
}catch(err){
    console.log(err)
}

const userSchema = joi.object({
    name: joi.string().required().min(3).max(100),
    password: joi.string().required(),
    email: joi.string().email().required(),
  });

app.post("/sign-up", async(req,res) => {
    const user = req.body

    try{
        const isUser = await db.collection("users").findOne({email: user.email})
        if(isUser){
            return res.status(409).send({ message: "Esse email já existe" })
        }
        const {error} = userSchema.validate(user, {abortEarly: false})
        if(error){
            const errors = error.details.map((detail) => detail.message);
            return res.status(400).send(errors)
        }

        const hashPassword = bcrypt.hashSync(user.password, 10)

        await db.collection("users").insertOne({...user, password: hashPassword})
        res.sendStatus(201)
    } catch(err){
        res.sendStatus(500)
    }
})

app.post("/sign-in", async(req,res) => {
    const {email, password} = req.body

    try{
        const isUser = await db.collection("users").findOne({email})
        if (!isUser) {
            return res.sendStatus(401);
        }
        const isPassword = bcrypt.compare(password, isUser.password)

        if (!isPassword) {
            return res.sendStatus(401);
        }

        const token = uuidV4()

        const isLogged = await db.collection("sessions").findOne({ userId: isUser._id })

        if(isLogged){
            return res.sendStatus(401)
        }

        await db.collection("sessions").insertOne({ token,userId: isUser._id})
        res.send({token})
    } catch(err){
        res.sendStatus(500)
    }
})


app.listen(5000, () => {
    console.log("Rodando em http://localhost:5000");
})