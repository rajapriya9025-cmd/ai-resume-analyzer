import { Router } from 'express';
import Analysis from '../models/Analysis.js';
import { dbReady } from '../config/db.js';
import { uploadResume } from '../middleware/upload.js';
import { extractText } from '../services/extractText.js';
import { compare } from '../services/matcher.js';

const router = Router();

/* POST /api/analyze
   multipart/form-data:
     resume          — the PDF (required)
     jobDescription  — the JD text (required)

   Returns the score, the matched skills and the missing skills. */
router.post('/', uploadResume.single('resume'), async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('No resume uploaded. Attach a PDF as the "resume" field.');
      error.status = 400;
      throw error;
    }

    const jobDescription = (req.body.jobDescription || '').trim();
    if (!jobDescription) {
      const error = new Error('No job description. Paste one in before comparing.');
      error.status = 400;
      throw error;
    }

    const resumeText = await extractText(req.file.buffer);
    const result = compare(resumeText, jobDescription);

    /* Saving is best-effort: if Mongo is down the learner still gets
       their score, they just lose the record of it. */
    let savedId = null;
    if (dbReady()) {
      const saved = await Analysis.create({
        resumeFileName: req.file.originalname,
        score: result.score,
        band: result.band,
        matchedSkills: result.matchedSkills,
        missingSkills: result.missingSkills,
        jdSkills: result.jdSkills,
        jdExcerpt: jobDescription.slice(0, 2000)
      });
      savedId = saved.id;
    }

    res.json({
      id: savedId,
      resumeFileName: req.file.originalname,
      ...result
    });
  } catch (error) {
    next(error);
  }
});

/* GET /api/analyze — the last 20 comparisons, newest first. */
router.get('/', async (req, res, next) => {
  try {
    if (!dbReady()) return res.json({ analyses: [] });
    const analyses = await Analysis.find().sort({ createdAt: -1 }).limit(20);
    res.json({ analyses });
  } catch (error) {
    next(error);
  }
});

export default router;
