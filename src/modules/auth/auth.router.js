
import {Router} from 'express';
import * as controller from './auth.controller.js';


const router = Router();
router.post('/register', controller.register);
router.post('/login', controller.login);
router.patch('/sendcode', controller.sendCode);
router.patch('/forgotpassword', controller.forgotPassword);



export default router;