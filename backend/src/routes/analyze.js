import { Router } from 'express';
import { createAnalysis, listAnalyses } from '../controllers/analyzeController.js';
import { uploadResume } from '../middleware/upload.js';
import { asyncHandler } from '../utils.js';

/* The router only maps paths to controller functions. No logic, no
   database, no error handling — that all lives a layer down, which is
   the point of the split decision #5 asked for. */
const router = Router();

router.post('/', uploadResume.single('resume'), asyncHandler(createAnalysis));
router.get('/', asyncHandler(listAnalyses));

export default router;
