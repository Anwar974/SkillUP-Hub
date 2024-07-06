import {roles} from '../../middleware/auth.js';

export const endpoints ={
    create: [roles.Admin],
    get: [roles.Admin,roles.User,roles.Instructor],
    active: [roles.User,roles.Instructor],
    delete: [roles.Admin],
}