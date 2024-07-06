import {Router} from 'express';
import * as controller from './category.controller.js'
import fileUpload, { fileType } from '../../ults/multer.js';
import { auth } from '../../middleware/auth.js';
// import subcategoryRouter from '../../modules/subcategory/subcategory.router.js';
import { endpoints } from './category.role.js';

const router = Router();

// router.use('/:id/subcategory',subcategoryRouter);
router.post('/',auth(endpoints.create), fileUpload(fileType.image).single('image'), controller.create)
router.get('/',auth(endpoints.get), controller.getAll);
router.get('/active',auth(endpoints.active), controller.getActive);
router.get('/:id',auth(endpoints.active), controller.getDetails);
router.patch('/:id',auth(endpoints.create),fileUpload(fileType.image).single('image'), controller.update);
router.delete('/:id',auth(endpoints.delete), controller.destroy);

export default router;