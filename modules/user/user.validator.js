import joi from 'joi'

export const updateProfile = {
    body : joi.object().required().keys({
        userName: joi
        .string()
        .pattern(new RegExp(/[A-Z][a-zA-Z][^@#&<>\"~;$^%{}?]{1,20}$/))
        .required(),
    }),
    headers : joi.object().required().keys({
        authorization : joi.string().required()
    }).options({allowUnknown : true})
}
export const softDelete = {
    headers : joi.object().required().keys({
        authorization : joi.string().required()
    }).options({allowUnknown : true})
}
