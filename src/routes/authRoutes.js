import { Router } from "express";
import { signIn, signUp } from "../controllers/authController.js";

const router = Router()

router.post("/sign-up", signIn)

router.post("/sign-in", signUp)

export default router

