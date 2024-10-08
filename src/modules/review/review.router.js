import {Router} from 'express';
import * as controller from './review.controller.js'
import { auth } from '../../middleware/auth.js';
import { endpoints } from './review.role.js';
import { asyncHandler } from '../../ults/catchError.js';

const router = Router({mergeParams: true});

router.post('/',auth(endpoints.create), asyncHandler(controller.postReview) );
router.patch('/',auth(endpoints.create), asyncHandler(controller.updateReview));
router.delete('/',auth(endpoints.create), asyncHandler(controller.deleteReview));


export default router;