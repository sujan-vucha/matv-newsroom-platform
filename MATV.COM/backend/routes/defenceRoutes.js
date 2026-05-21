import express from 'express';
import {
  getAllDefence,
  getSingleDefence,
  updateAllDefence
} from '../controllers/defenceController.js';

const router = express.Router();

router.get('/', getAllDefence);
router.get('/:id', getSingleDefence);
router.post('/', updateAllDefence); // Admin update

export default router;
