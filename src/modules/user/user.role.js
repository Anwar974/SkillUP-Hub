import {roles} from '../../middleware/auth.js';

export const endpoints ={
    createUser: [roles.Admin],
    deactivateAccount: [roles.User,roles.Instructor],
    changeUserStatus : [roles.Admin],
    editProfile : [roles.Instructor],
    getUsers: [roles.Admin],
    getBookmarks: [roles.User],
    myApplications: [roles.User],
    userData:[roles.Admin, roles.Instructor, roles.User],
}
