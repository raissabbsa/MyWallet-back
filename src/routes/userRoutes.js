import { Router } from "express";
import {deleteUser, postUser, getUser} from "../controllers/userControler.js"
const router = Router()

router.post("/user", postUser)

router.get("/user", getUser)

router.delete("/user", deleteUser)

export default router
