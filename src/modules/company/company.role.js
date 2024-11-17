import {roles} from '../../middleware/auth.js';

export const endpoints ={
    post:[roles.Instructor, roles.Admin],
    update:[roles.Instructor, roles.Admin],
    // delete:[roles.Instructor, roles.Admin],
}