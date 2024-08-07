import {roles} from '../../middleware/auth.js';

export const endpoints ={
    postTrainning: [roles.Instructor],
    get: [roles.Admin,roles.Instructor,roles.User],
    update : [roles.Instructor],
    // active: [roles.User,roles.Instructor],
    delete: [roles.Instructor],
}