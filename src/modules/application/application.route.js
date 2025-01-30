import { Router } from 'express';
import * as controller from './application.controller.js';
import { auth } from '../../middleware/auth.js';
import { endpoints } from './application.role.js'; // Adjust according to your actual role file
import { validation } from '../../middleware/validation.js';
import * as schema from './application.validation.js';
import { asyncHandler } from '../../ults/catchError.js';
const router = Router({mergeParams:true});

router.post('/',asyncHandler(controller.addProgramType),validation(schema.postApplicationSchema), auth(endpoints.post), asyncHandler(controller.postApplication));
router.get('/', asyncHandler(controller.getApplicationsByProgram));
router.get('/export-for-program', asyncHandler(controller.exportApplicationsByProgram));

router.get('/user-application', auth(endpoints.myApplication), controller.getApplicationById);
router.patch('/:id',asyncHandler(controller.addProgramType), validation(schema.updateApplicationSchema), auth(endpoints.update), asyncHandler(controller.updateApplication));
router.patch('/:id/update-status', validation(schema.updateApplicationStatusSchema), auth(endpoints.updateStatus), asyncHandler(controller.updateApplicationStatus))
router.patch('/:id/enrollment-status', validation(schema.updateEnrollmentStatusSchema), auth(endpoints.updateStatus), asyncHandler(controller.updateEnrollmentStatus));;
router.delete('/', validation(schema.deleteByStatusSchema), auth(endpoints.delete), asyncHandler(controller.deleteByStatus));
router.delete('/:id', validation(schema.deleteApplicationSchema), auth(endpoints.delete), asyncHandler(controller.deleteApplication));

router.get("/export", asyncHandler(controller.exportApplicationsToCSV));

export default router;
