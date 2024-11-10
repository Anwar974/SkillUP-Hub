import {roles} from '../../middleware/auth.js';

export const endpoints ={
   post: [roles.User],
    get: [roles.Admin,roles.Instructor],
    update : [roles.User],
    updateStatus : [roles.Instructor],
    delete: [roles.User,roles.Instructor],
    myApplication: [roles.User],

}