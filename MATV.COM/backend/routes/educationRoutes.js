import express from 'express';
import {
  getAllEducation,
  getSingleEducation,
  updateAllEducation
} from '../controllers/educationController.js';

const router = express.Router();

router.get('/', getAllEducation);
router.get('/:id', getSingleEducation);
router.post('/', updateAllEducation);

export default router;
