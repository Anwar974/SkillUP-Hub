import {Router} from 'express';
import * as controller from './company.controller.js'
import { auth } from '../../middleware/auth.js';
import { validation } from '../../middleware/validation.js';
import { asyncHandler } from '../../ults/catchError.js';
import { endpoints } from './company.role.js';
import * as schema from './company.validation.js'
import fileUpload, { fileType } from '../../ults/multer.js';

const router = Router();

router.post('/',fileUpload(fileType.image).single('image'),(err, req, res, next) => {
    if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();  // Proceed to validation and further processing
},
 validation(schema.postCompanySchema), auth(endpoints.post), asyncHandler(controller.postCopmany));

router.get('/', asyncHandler(controller.getCompanies));
router.get('/:userId/companies',auth(endpoints.get), asyncHandler(controller.getInstructorCompanies));
router.get('/:id', asyncHandler(controller.getCompanyById));
router.patch('/:id',fileUpload(fileType.image).single('image'), validation(schema.updateCompanySchema), auth(endpoints.update), controller.updateCompany);
router.delete('/:id', validation(schema.deleteCompanySchema),auth(endpoints.delete), controller.deleteCompany);

export default router;
