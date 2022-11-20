import bcrypt from "bcrypt"
import { v4 as uuidV4 } from "uuid"
import { sessionsCollection, usersCollection } from "../database/db.js"
import { userSchema } from "../models/user.models.js"

export async function signIn(req, res) {
    const user = req.body

    try {
        const isUser = await usersCollection.findOne({ email: user.email })
        if (isUser) {
            return res.status(409).send({ message: "Esse email já existe" })
        }
        const { error } = userSchema.validate(user, { abortEarly: false })
        if (error) {
            const errors = error.details.map((detail) => detail.message);
            return res.status(400).send(errors)
        }

        const hashPassword = bcrypt.hashSync(user.password, 10)

        await usersCollection.insertOne({ ...user, password: hashPassword })
        res.sendStatus(201)
    } catch (err) {
        res.sendStatus(500)
    }
}

export async function signUp(req, res) {
    const { email, password } = req.body

    try {
        const isUser = await usersCollection.findOne({ email })
        if (!isUser) {
            return res.sendStatus(401);
        }
        const isPassword = bcrypt.compare(password, isUser.password)

        if (!isPassword) {
            return res.sendStatus(401);
        }

        const token = uuidV4()

        const isLogged = await sessionsCollection.findOne({ userId: isUser._id })

        if (isLogged) {
            return res.status(401).send({ message: "Você já está logado, saia para logar novamente" })
        }

        await sessionsCollection.insertOne({ token, userId: isUser._id })

        isUser.delete
        res.send({ token })
    } catch (err) {
        res.sendStatus(500)
    }
}