import express from 'express';
import {
  getAllIndiaNews,
  getSingleIndiaNews,
  updateAllIndiaNews
} from '../controllers/indiaNewsController.js';

const router = express.Router();

router.get('/', getAllIndiaNews);
router.get('/:id', getSingleIndiaNews);
router.post('/', updateAllIndiaNews); // Admin endpoint to update all news items

export default router;
