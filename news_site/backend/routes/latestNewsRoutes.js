import express from 'express';
import {
  getAllLatestNews,
  getSingleLatestNews,
  updateAllLatestNews
} from '../controllers/latestNewsController.js';

const router = express.Router();

router.get('/', getAllLatestNews);
router.get('/:id', getSingleLatestNews);
router.post('/', updateAllLatestNews); // For admin panel content update

export default router;
