import Joi from 'joi';



 export const postTrainningProgramSchema = Joi.object({
   title: Joi.string().required(),
   description: Joi.string().required(),
   company: Joi.string().required(),
   location: Joi.string().required(),
   mode: Joi.string().valid('online', 'offline', 'hybrid').default('offline'),
   startDate: Joi.date().required(),
   endDate: Joi.date().required(),
   hasApplicationForm: Joi.boolean().default(false),
      categoryId: Joi.string().hex().length(24).required(),

 })

 export const updateProgramSchema = Joi.object({
   id: Joi.string().hex().length(24),
   title: Joi.string().optional(),
   description: Joi.string().optional(),
   company: Joi.string().optional(),
   location: Joi.string().optional(),
   mode: Joi.string().valid('online', 'offline', 'hybrid').optional(),
   startDate: Joi.date().optional(), 
   endDate: Joi.date().optional(),
   hasApplicationForm: Joi.boolean().default(false).optional(),
   categoryId: Joi.string().hex().length(24).optional(),
});

export const deleteProgramSchema = Joi.object({
   id:Joi.string().hex().length(24),
  
})

 