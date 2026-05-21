import express from 'express';
import {
  getAllSportfit,
  getSingleSportfit,
  updateAllSportfit
} from '../controllers/sportfitController.js';

const router = express.Router();

router.get('/', getAllSportfit);
router.get('/:id', getSingleSportfit);
router.post('/', updateAllSportfit);

export default router;
