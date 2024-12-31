import {roles} from '../../middleware/auth.js';

export const endpoints ={
    post:[roles.Instructor, roles.Admin],
    update:[roles.Instructor, roles.Admin],
    get:[roles.Instructor, roles.Admin, roles.User],
}