import express from 'express';
import {
  getAllTech,
  getSingleTech,
  updateAllTech
} from '../controllers/techController.js';

const router = express.Router();

router.get('/', getAllTech);
router.get('/:id', getSingleTech);
router.post('/', updateAllTech);

export default router;
