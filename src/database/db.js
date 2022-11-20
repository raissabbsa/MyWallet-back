import { MongoClient } from "mongodb"
import dotenv from "dotenv"
dotenv.config()

const mongoCliente = new MongoClient(process.env.MONGO_URI)

try {
    await mongoCliente.connect()
} catch (err) {
    console.log(err)
}

const db = mongoCliente.db("myWallet")

export const registrysCollection = db.collection("registrys")
export const sessionsCollection = db.collection("sessions")
export const usersCollection = db.collection("users");

