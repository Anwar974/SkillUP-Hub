import {roles} from '../../middleware/auth.js';

export const endpoints ={
    postTrainning: [roles.Instructor],
    get: [roles.Admin,roles.Instructor,roles.User],
    update : [roles.Instructor],
    bookmarkProgram : [roles.User],
    delete: [roles.Instructor],
}