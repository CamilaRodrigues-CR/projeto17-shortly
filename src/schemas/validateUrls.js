import Joi from "joi";

export const urlsSchema = Joi.object({
    url: Joi.string().uri().trim().required()
});
