import joi from "joi";

export const registrySchema = joi.object({
    description: joi.string().required(),
    value: joi.number().required(),
    type: joi.string().valid("entrada", "saida").required()
})