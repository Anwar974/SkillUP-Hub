import Joi from 'joi';

 export const postApplicationSchema = Joi.object({
    programId: Joi.string().hex().length(24),
    status: Joi.string().valid('Pending', 'Rejected', 'Accepted').default('Pending'),
    appliedAt: Joi.date(),
    arabicName: Joi.string().required(),
    englishName: Joi.string().required(),
    email:Joi.string().email().required(),
    phone: Joi.string().required(),
    studentId: Joi.string().length(9).required(),
    gender: Joi.string().required(),
    gradeEnglish1: Joi.number().min(0).max(100).required(),
    gradeEnglish2: Joi.number().min(0).max(100).required(),
    gba: Joi.number().min(0).max(100).required(),
    hoursPassed: Joi.number().required(),
    year: Joi.string().valid('سنة أولى', 'سنة ثانية', 'سنة ثالثة', 'سنة رابعة', 'سنة خامسة').required(),
    fieldTrainingsPassed: Joi.string().valid('تدريب ميداني 1', 'تدريب ميداني 2', 'كليهما', 'لا شيئ مما ذكر').required(),
    branch: Joi.string().valid('طولكرم','رام الله','العروب').required(),
    arabicName: Joi.string().required(),
    notes: Joi.string().optional(),

    // passportInfo: Joi.when('programType', {
    //     is: 'international',
    //     then: Joi.string().valid('جواز فلسطيني', 'جواز أردني', 'جواز سفر آخر', 'لا املك جواز سفر').required(),
    //     otherwise: Joi.forbidden(), 
    // }),
    // visa: Joi.when('programType', {
    //     is: 'international',
    //     then: Joi.string().required(),
    //     otherwise: Joi.forbidden(),
    // }),
    // localId: Joi.when('programType', {
    //     is: 'local',
    //     then: Joi.string().required(),
    //     otherwise: Joi.forbidden(),
    // }),
    
});


export const updateApplicationSchema = Joi.object({
    programId: Joi.string().hex().length(24),
    id: Joi.string().required(), // Ensure ID is provided
    arabicName: Joi.string().optional(),
    englishName: Joi.string().optional(),
    studentId: Joi.string().optional(),
    email:Joi.string().email().optional(),
    phone: Joi.string().optional(),
    gender: Joi.string().optional(),
    gradeEnglish1: Joi.number().min(0).max(100).optional(),
    gradeEnglish2: Joi.number().min(0).max(100).optional(),
    gba: Joi.number().min(0).max(100).optional(),
    hoursPassed: Joi.number().optional(),
    year: Joi.string().valid('سنة أولى', 'سنة ثانية', 'سنة ثالثة', 'سنة رابعة', 'سنة خامسة').optional(),
    fieldTrainingsPassed: Joi.string().valid('تدريب ميداني 1', 'تدريب ميداني 2', 'كليهما', 'لا شيئ مما ذكر').optional(),
    branch: Joi.string().valid('طولكرم','رام الله','العروب').optional(),
    notes: Joi.string().optional(),

});

export const updateApplicationStatusSchema = Joi.object({
    programId: Joi.string().hex().length(24),
    id: Joi.string().required(), 
    status: Joi.string().valid('Pending','Rejected','Accepted').required(),
});

export const updateEnrollmentStatusSchema = Joi.object({
    programId: Joi.string().hex().length(24),
    id: Joi.string().required(), 
    enrollmentStatus: Joi.string().valid('Enrolled', 'Passed', 'Failed', 'Off Track').required(),
});

export const deleteByStatusSchema = Joi.object({
    programId: Joi.string().required(), 
    status: Joi.string().valid('Pending','Rejected','Accepted').required(),
});

export const deleteApplicationSchema = Joi.object({
    id:Joi.string().hex().length(24),
    programId: Joi.string().required(), // Ensure ID is provided

   
 })

