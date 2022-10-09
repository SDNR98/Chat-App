import Joi from 'joi';

const schema = Joi.object({
    userName: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .min(3)
        .required(),
});

export default schema;