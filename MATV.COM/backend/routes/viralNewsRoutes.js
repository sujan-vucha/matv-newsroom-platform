// backend/routes/viralNewsRoutes.js
import express from 'express';
import {
  getAllViralNews,
  getSingleViralNews,
  updateAllViralNews
} from '../controllers/viralNewsController.js';

const router = express.Router();

router.get('/', getAllViralNews);
router.get('/:id', getSingleViralNews);
router.post('/', updateAllViralNews); // This one is for admin panel

export default router;
