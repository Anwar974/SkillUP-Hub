import Joi from 'joi';

 export const createUserSchema = Joi.object({
   userName: Joi.string().min(3).max(30).required(),
   email:Joi.string().email().required(),
   password:Joi.string().pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{3,20}$/),
   confirmPassword:Joi.valid(Joi.ref('password')),

})

export const changeStatusSchema = Joi.object({
    id:Joi.string().hex().length(24),
    status: Joi.string().valid('Active', 'NotActive').required(),
});
export const editProfileSchema = Joi.object({
    id:Joi.string().hex().length(24),
    userName: Joi.string().min(3).max(30).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().pattern(/^[A-Z][a-z0-9]{3,20}$/).optional(),
    confirmPassword: Joi.valid(Joi.ref('password')).messages({
        'any.only': 'Password and confirm password do not match'
    }).optional(),
    phone: Joi.string().optional(),

    socialLinks: Joi.object({
        facebook: Joi.string().uri().allow('', null).optional(),
        linkedIn: Joi.string().uri().allow('', null).optional(),
        github: Joi.string().uri().allow('', null).optional()
    }).optional(),
    phone: Joi.string().optional(), // Make phone optional
    gender: Joi.string().optional(), // Make gender optional
    department: Joi.string().optional(), // Make department optional
    image:Joi.object({
        fieldname:Joi.string().required(),
        originalname:Joi.string().required(),
        encoding:Joi.string().required(),
        mimetype:Joi.string().valid('image/png','image/jpeg','image/jpg','image/webp').required(),
        destination:Joi.string().required(),
        filename:Joi.string().required(),
        path:Joi.string().required(),
        size:Joi.number().max(5000000).required()
    }).optional()

});
