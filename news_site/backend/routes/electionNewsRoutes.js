import express from 'express';
import {
  getAllElectionNews,
  getSingleElectionNews,
  updateAllElectionNews
} from '../controllers/electionNewsController.js';

const router = express.Router();

router.get('/', getAllElectionNews);
router.get('/:id', getSingleElectionNews);
router.post('/', updateAllElectionNews);

export default router;
