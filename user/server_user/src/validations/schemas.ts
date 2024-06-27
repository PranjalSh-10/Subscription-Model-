import Joi from "joi";

export const registerValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(3).max(30).pattern(/^[a-zA-Z]+$/).required().messages({
        'string.pattern.base': 'Name should only contain letters and spaces',
    }),
    password: Joi.string().min(8).required(),
    // repeat_password: Joi.ref('password'),
});


export const loginValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});


export const accessResourceValidationSchema = Joi.object({
    imageId: Joi.string().length(24).hex().required(),
})


export const subscribeValidationSchema = Joi.object({
    planId: Joi.string().length(24).hex().required(),
});

export const unsubscribeValidationSchema = Joi.object({
    planName: Joi.string().required(),
    leftResources: Joi.number().required(),
})