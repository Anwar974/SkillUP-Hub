import {roles} from '../../middleware/auth.js';

export const endpoints ={
    createUser: [roles.Admin],
    deleteUser: [roles.Admin],
    changeUserStatus : [roles.Admin],
    editProfile : [roles.Instructor],
    getUsers: [roles.Admin],
    getUserData: [roles.Admin,roles.User]

}