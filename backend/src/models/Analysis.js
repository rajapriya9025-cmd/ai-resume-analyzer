import mongoose from 'mongoose';

/* One record per comparison. The resume text itself is NOT stored —
   it is personal data and we only need the outcome. The job
   description is capped because it is the one thing you might want
   to re-run later. */
const analysisSchema = new mongoose.Schema(
  {
    resumeFileName: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    band: { type: String, enum: ['high', 'mid', 'low'], required: true },
    matchedSkills: [String],
    missingSkills: [String],
    jdSkills: [String],
    jdExcerpt: { type: String, maxlength: 2000 }
  },
  { timestamps: true }
);

export default mongoose.model('Analysis', analysisSchema);
