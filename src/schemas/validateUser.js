import Joi from "joi";

export const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().trim().required(),
    password:Joi.string().min(3).required(),
    confirmPassword:Joi.string().min(3).required()
});

