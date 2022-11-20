import joi from "joi";

export const userSchema = joi.object({
    name: joi.string().required().min(2).max(100),
    password: joi.string().required(),
    email: joi.string().email().required(),
});