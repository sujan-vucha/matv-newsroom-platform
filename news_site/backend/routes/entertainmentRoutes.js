import express from 'express';
import {
  getAllEntertainment,
  getSingleEntertainment,
  updateAllEntertainment
} from '../controllers/entertainmentController.js';

const router = express.Router();

router.get('/', getAllEntertainment);
router.get('/:id', getSingleEntertainment);
router.post('/', updateAllEntertainment);

export default router;
