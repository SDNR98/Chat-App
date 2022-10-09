import Joi from 'joi';

const schema = Joi.object({
    idName: Joi.string()
        .alphanum()
        .min(4)
        .max(30)
        .required(),

    password: Joi.string()
        .min(4)
        .max(20),
    isPassword : Joi.boolean()
});

export default schema;