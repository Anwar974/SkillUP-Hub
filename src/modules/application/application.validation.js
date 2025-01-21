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
    programType: Joi.string().required(),
    major: Joi.string().required(),
    notes: Joi.string().optional(),

    // International-specific fields
     isRegisteredThisSemester: Joi.when('programType', {
        is: 'international',
        then: Joi.boolean().required(),
        otherwise: Joi.forbidden(),
    }),
    hasDisciplinaryActions: Joi.when('programType', { is: 'international', then: Joi.boolean().required(), otherwise: Joi.forbidden(),
    }),
    nationality: Joi.when('programType', { is: 'international', then: Joi.string().required(), otherwise: Joi.forbidden(),
    }),
    passportInfo: Joi.when('programType', {
        is: 'international',
        then: Joi.alternatives().try(
            Joi.string().valid('جواز فلسطيني', 'جواز أردني', 'جواز سفر آخر', 'لا أملك جواز سفر'),
            Joi.string().min(1) // Allow any string (custom values)
        ).required(),
        otherwise: Joi.forbidden(),
    }),
    isPassportValid: Joi.when('programType', { is: 'international', then: Joi.boolean().required(), otherwise: Joi.forbidden(),
    }),
    academicDegree: Joi.when('programType', {
        is: 'international',
        then: Joi.string()
            .valid('بكالوريوس', 'ماجستير', 'دكتوراه')
            .required(),
        otherwise: Joi.forbidden(),
    }),
    hasTravelRestrictions: Joi.when('programType', { is: 'international', then: Joi.boolean().required(), otherwise: Joi.forbidden(),
    }),
    hasEUVisa: Joi.when('programType', { is: 'international', then: Joi.boolean().required(), otherwise: Joi.forbidden(),
    }),
    visaDetails: Joi.when('programType', { is: 'international',
        then: Joi.when('hasEUVisa', {
            is: true,
            then: Joi.string().required(),
            otherwise: Joi.string().optional(),
        }),
        otherwise: Joi.forbidden(),
    }),
   


// local 
    
    trainingsParticipatedIn: Joi.when('programType',  {is: 'local', then: Joi.string().optional(), otherwise: Joi.forbidden(),
    }),
    
    awardsReceived: Joi.when('programType', { is: 'local', then: Joi.string().optional(),otherwise: Joi.forbidden(),
    }),
    socialLinks: Joi.when('programType', {
        is: 'local',
        then: Joi.object({
            facebook: Joi.string().uri().optional(),
            linkedIn: Joi.string().uri().optional(),
            github: Joi.string().uri().optional(),
        }).required(),
        otherwise: Joi.forbidden(),
    }),

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
    programType: Joi.string().optional(),
    major: Joi.string().optional(),

     // for international 

     isRegisteredThisSemester: Joi.when('programType', {is: 'international',then: Joi.boolean().optional(),otherwise: Joi.forbidden(),
    }),

    hasDisciplinaryActions: Joi.when('programType', {is: 'international', then: Joi.boolean().optional(), otherwise: Joi.forbidden(),
    }),

    nationality: Joi.when('programType', { is: 'international', then: Joi.string().optional(), otherwise: Joi.forbidden(),
    }),

    passportInfo: Joi.when('programType', {is: 'international',
        then: Joi.string()
            .valid('جواز فلسطيني', 'جواز أردني', 'جواز سفر آخر', 'لا أملك جواز سفر')
            .optional(),
        otherwise: Joi.forbidden(),
    }),

    isPassportValid: Joi.when('programType', {is: 'international',then: Joi.boolean().optional(),otherwise: Joi.forbidden(),
    }),

    academicDegree: Joi.when('programType', { is: 'international',
        then: Joi.string().valid('بكالوريوس', 'ماجستير', 'دكتوراه').optional(),
        otherwise: Joi.forbidden(),
    }),

    hasTravelRestrictions: Joi.when('programType', {is: 'international',then: Joi.boolean().optional(),otherwise: Joi.forbidden(),
    }),

    hasEUVisa: Joi.when('programType', {is: 'international',then: Joi.boolean().optional(),otherwise: Joi.forbidden(),
    }),

    visaDetails: Joi.when('programType', {
        is: 'international',
        then: Joi.when('hasEUVisa', {is: true, then: Joi.string().optional(), otherwise: Joi.string().optional(),
        }),
        otherwise: Joi.forbidden(),
    }),



// local 
    trainingsParticipatedIn: Joi.when('programType', { is: 'local', then: Joi.array().items(Joi.string()).optional(),
        otherwise: Joi.forbidden(),
    }),
    
    awardsReceived: Joi.when('programType', {is: 'local', then: Joi.array().items(Joi.string()).optional(),
        otherwise: Joi.forbidden(),
    }),
    socialLinks: Joi.when('programType', {
        is: 'local',
        then: Joi.object({
            facebook: Joi.string().uri().optional(),
            linkedIn: Joi.string().uri().optional(),
            github: Joi.string().uri().optional(),
        }).required(),
        otherwise: Joi.forbidden(),
    }),

    



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

