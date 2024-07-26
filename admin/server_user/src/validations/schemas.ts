import Joi from "joi";

export const loginValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});


export const planValidationSchema = Joi.object({
    name: Joi.string().required(),
    features: Joi.string().allow('').optional(),
    resources: Joi.number().required().min(1),
    price: Joi.number().required(),
    duration: Joi.number().required().greater(0),
    resourceArray: Joi.array().required(),
});
