import express from 'express';
import {
  getAllScienceNews,
  getSingleScienceNews,
  updateAllScienceNews
} from '../controllers/scienceNewsController.js';

const router = express.Router();

router.get('/', getAllScienceNews);
router.get('/:id', getSingleScienceNews);
router.post('/', updateAllScienceNews); // Admin endpoint to update all news items

export default router;
