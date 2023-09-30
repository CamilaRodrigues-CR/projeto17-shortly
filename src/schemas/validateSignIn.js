import Joi from "joi";

export const signInSchema = Joi.object({
    email: Joi.string().email().trim().required(),
    password:Joi.string().min(3).required()
});
