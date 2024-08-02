import {roles} from '../../middleware/auth.js';

export const endpoints ={
    create: [roles.Admin],
    get: [roles.Admin,roles.Instructor,roles.User],
    active: [roles.User,roles.Instructor],
    delete: [roles.Admin],
}