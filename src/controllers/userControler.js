import dayjs from "dayjs";
import { registrySchema } from "../models/registry.model.js";
import { registrysCollection, sessionsCollection, usersCollection } from "../database/db.js"

export async function deleteUser (req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if (!token) return res.sendStatus(401)
    try {
        await sessionsCollection.deleteOne({ token })
        res.sendStatus(201)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}

export async function getUser (req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if (!token) return res.sendStatus(401)
    console.log(token)
    try {
        const session = await sessionsCollection.findOne({ token })
        console.log(session)
        const user = await usersCollection.findOne({ _id: session?.userId })
        if (!user) return res.sendStatus(401);
        delete user.password
        const registry = await registrysCollection.find({ userId: session?.userId }).toArray()
        res.send({ registry, user }).status(201)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }

}

export async function postUser(req, res) {
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")
    console.log(token, "token")
    if (!token) return res.sendStatus(401)

    const { description, value, type } = req.body

    const { error } = registrySchema.validate({ description, value, type }, { abortEarly: false })
    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).send(errors)
    }

    const session = await sessionsCollection.findOne({ token })

    if (!session) return res.sendStatus(401)

    const user = usersCollection.findOne({ _id: session.userId })

    if (user) {
        const item = {
            description,
            value,
            type,
            date: `${dayjs().day()}/${dayjs().month()}/${dayjs().year()}`,
            userId: session.userId
        }
        await registrysCollection.insertOne(item)
        res.sendStatus(201)
    }
    else {
        res.sendStatus(401)
    }
}