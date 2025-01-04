import Joi from 'joi';

// Simplified validation schema for posting a company
export const postCompanySchema = Joi.object({
    companyName: Joi.string().min(4).max(30).required(),
    description: Joi.string().allow('', null).optional(),
    locations: Joi.array().items(Joi.string().required()).min(1).required(),
    industry: Joi.string().required(),
    companySize: Joi.string().allow('', null).optional(),
    foundedIn: Joi.string().allow('', null).optional(),

    socialLinks: Joi.object({
        facebook: Joi.string().uri().allow('', null).optional(),
        linkedIn: Joi.string().uri().allow('', null).optional(),
        phoneNumber: Joi.string().allow('', null).optional(),
        email: Joi.string().email().allow('', null).optional(),
    }),

    image:Joi.object({
    fieldname:Joi.string().required(),
    originalname:Joi.string().required(),
    encoding:Joi.string().required(),
    mimetype:Joi.string().valid('image/png','image/jpeg','image/jpg','image/webp').required(),
    destination:Joi.string().required(),
    filename:Joi.string().required(),
    path:Joi.string().required(),
    size:Joi.number().max(5000000).required()
}).required()

});

export const updateCompanySchema = Joi.object({
    id:Joi.string().hex().length(24),
    companyName: Joi.string().min(4).max(30).optional(),
    description: Joi.string().allow('', null).optional(),
    locations: Joi.array().items(Joi.string().required()).min(1).optional(),
    industry: Joi.string().optional(),
    companySize: Joi.string().allow('', null).optional(),
    foundedIn: Joi.string().allow('', null).optional(),

    socialLinks: Joi.object({
        facebook: Joi.string().uri().allow('', null).optional(),
        linkedIn: Joi.string().uri().allow('', null).optional(),
        phoneNumber: Joi.string().allow('', null).optional(),
        email: Joi.string().email().allow('', null).optional(),
    }).optional(),

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
export const deleteCompanySchema = Joi.object({
        id:Joi.string().hex().length(24),
});
