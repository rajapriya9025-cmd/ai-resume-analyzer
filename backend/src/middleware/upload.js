import multer from 'multer';
import { badRequest } from '../utils.js';

const MAX_BYTES = 5 * 1024 * 1024;

/* memoryStorage keeps the upload in RAM instead of writing a temp
   file we would then have to clean up. Fine at 5 MB; for larger
   limits you would stream to disk instead. */
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const isPdf = file.mimetype === 'application/pdf' || /\.pdf$/i.test(file.originalname);
  if (isPdf) return cb(null, true);
  cb(badRequest('That is not a PDF. Upload a PDF resume.'));
}

export const uploadResume = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_BYTES }
});
