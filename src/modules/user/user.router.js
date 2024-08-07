import {Router} from 'express';
import * as controller from './user.controller.js'
import { auth } from '../../middleware/auth.js';
import { endpoints } from './user.role.js';
import { validation } from '../../middleware/validation.js';
import * as schema from './user.validation.js';
import { checkEmail } from '../../middleware/chackEmail.js';
import { asyncHandler } from '../../ults/catchError.js';
import fileUpload, { fileType } from './../../ults/multer.js';

const router = Router();

router.get('/',auth(endpoints.getUsers), asyncHandler(controller.getUsers) );
router.get('/userData',auth(endpoints.userData), controller.getUserData);
router.post('/create-user',auth(endpoints.createUser),validation(schema.createUserSchema),checkEmail,asyncHandler(controller.createUser) );
router.patch('/:id',validation(schema.changeStatusSchema),auth(endpoints.changeUserStatus),asyncHandler(controller.changeUserStatus));
router.patch('/edit-profile/:id',fileUpload(fileType.image).single('image'), validation(schema.editProfileSchema),
auth(endpoints.editProfile),asyncHandler(controller.editProfile));
router.delete('/:id',validation(schema.deleteUserSchema),auth(endpoints.deleteUser),asyncHandler(controller.deleteUser));

export default router;