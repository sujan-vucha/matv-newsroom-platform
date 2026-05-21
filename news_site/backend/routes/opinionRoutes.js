import express from 'express';
import {
  getAllOpinion,
  getSingleOpinion,
  updateAllOpinion
} from '../controllers/opinionController.js';

const router = express.Router();

router.get('/', getAllOpinion);
router.get('/:id', getSingleOpinion);
router.post('/', updateAllOpinion); // Admin endpoint

export default router;
