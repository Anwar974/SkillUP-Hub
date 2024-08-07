import {Router} from 'express';
import * as controller from './program.controller.js'
import { auth } from '../../middleware/auth.js';
import { endpoints } from './program.role.js';
import { validation } from '../../middleware/validation.js';
import { asyncHandler } from '../../ults/catchError.js';
import * as schema from './program.validation.js'
import applicationRouter from './../application/application.route.js'
import reviewRouter from './../review/review.router.js'

const router = Router();

router.use('/:programId/application',applicationRouter);
router.use('/:programId/review',reviewRouter);
router.post('/', validation(schema.postTrainningProgramSchema), auth(endpoints.postTrainning), asyncHandler(controller.postProgram));
router.get('/', asyncHandler(controller.getPrograms));
router.get('/:id',auth(endpoints.get), asyncHandler(controller.getProgramById));
router.patch('/:id',validation(schema.updateProgramSchema), auth(endpoints.update), controller.updateProgram);
router.delete('/:id', validation(schema.deleteProgramSchema),auth(endpoints.delete), controller.deleteProgram);

export default router;
