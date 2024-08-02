
import {Router} from 'express';
import * as controller from './auth.controller.js';
import { validation } from '../../middleware/validation.js';
import { checkEmail } from '../../middleware/chackEmail.js';
import { asyncHandler } from '../../ults/catchError.js';
import * as schema from './auth.validation.js';


const router = Router();
router.post('/register',validation(schema.registerSchema),checkEmail,asyncHandler(controller.register) );
router.post('/login', validation(schema.loginSchema),controller.login);
router.patch('/sendcode',validation(schema.sendCodeSchema), controller.sendCode);
router.patch('/forgotpassword',validation(schema.forgotPasswordSchema), controller.forgotPassword);
router.get('/confirmEmail/:token',controller.confirmEmail);




export default router;