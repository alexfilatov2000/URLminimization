const Joi = require('@hapi/joi');

export const registerSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    password2: Joi.ref('password'),
});

export const loginSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
});

export const resetSchema = Joi.object({
    password: Joi.string().min(6).required(),
    password2: Joi.ref('password'),
});
