import Joi from 'joi';



 export const postTrainningProgramSchema = Joi.object({
   title: Joi.string().required(),
   description: Joi.string().required(),
   company: Joi.string().required(),
   location: Joi.string().optional(),
   mode: Joi.string().valid('online', 'offline', 'hybrid').default('offline'),
   type: Joi.string().valid('local', 'international').required(),
   hasApplicationForm: Joi.boolean().default(false),
   majors: Joi.array()
   .items(Joi.string())
   .min(1)
   .optional()
   .when('hasApplicationForm', {
       is: true,
       then: Joi.array().when('type', {
           is: 'international',
           then: Joi.optional(),
           otherwise: Joi.forbidden().messages({
               'any.forbidden': 'Majors should not be provided for local programs with an application form.',
           }),
       }),
       otherwise: Joi.forbidden().messages({
           'any.forbidden': 'Majors should not be provided if the program does not have an application form.',
       }),
   }),
   majors: Joi.array()
   .items(Joi.string())
   .min(1)
   .optional()
   .when('hasApplicationForm', {
       is: true,
       then: Joi.array().when('type', {
           is: 'international',
           then: Joi.required().messages({
               'any.required': 'Majors are required for international programs with an application form.',
           }),
           otherwise: Joi.forbidden().messages({
               'any.forbidden': 'Majors should not be provided for local programs with an application form.',
           }),
       }),
       otherwise: Joi.forbidden().messages({
           'any.forbidden': 'Majors should not be provided if the program does not have an application form.',
       }),
   }),
    startDate: Joi.date().required(),
   endDate: Joi.date().required(),
   categoryId: Joi.string().hex().length(24).required(),

 })

 export const updateProgramSchema = Joi.object({
   id: Joi.string().hex().length(24),
   title: Joi.string().optional(),
   description: Joi.string().optional(),
   company: Joi.string().optional(),
   location: Joi.string().optional(),
   mode: Joi.string().valid('online', 'offline', 'hybrid').optional(),
   type: Joi.string().valid('local', 'international').required(),
   hasApplicationForm: Joi.boolean().default(false).optional(),
   majors: Joi.array()
   .items(Joi.string())
   .min(1)
   .optional()
   .when('hasApplicationForm', {
       is: true,
       then: Joi.array().when('type', {
           is: 'international',
           then: Joi.required().messages({
               'any.required': 'Majors are required for international programs with an application form.',
           }),
           otherwise: Joi.forbidden().messages({
               'any.forbidden': 'Majors should not be provided for local programs with an application form.',
           }),
       }),
       otherwise: Joi.forbidden().messages({
           'any.forbidden': 'Majors should not be provided if the program does not have an application form.',
       }),
   }),
   startDate: Joi.date().optional(), 
   endDate: Joi.date().optional(),
   categoryId: Joi.string().hex().length(24).optional(),
});

export const deleteProgramSchema = Joi.object({
   id:Joi.string().hex().length(24),
  
})

 