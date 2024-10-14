import {Router} from 'express';
import * as controller from './category.controller.js'
import fileUpload, { fileType } from '../../ults/multer.js';
import { auth } from '../../middleware/auth.js';
import { endpoints } from './category.role.js';
import { validation } from '../../middleware/validation.js';
import * as schema from './category.validation.js'
const router = Router();

// router.use('/:id/subcategory',subcategoryRouter);
router.post('/', fileUpload(fileType.image).single('image'),validation(schema.createCategorySchema) ,auth(endpoints.create),controller.create)
router.get('/', controller.getAll);
router.get('/active',auth(endpoints.active), controller.getActive);
router.get('/:id',validation(schema.getDetailsCategorySchema),auth(endpoints.active), controller.getDetails);
router.patch('/:id',fileUpload(fileType.image).single('image'),validation(schema.updateCategorySchema),auth(endpoints.create), controller.update);
router.delete('/:id',validation(schema.deleteCategorySchema),auth(endpoints.delete), controller.destroy);

export default router;