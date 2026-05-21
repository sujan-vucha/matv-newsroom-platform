import express from 'express';
import {
  getAllInitiatives,
  getSingleInitiative,
  updateAllInitiatives
} from '../controllers/initiativesController.js';

const router = express.Router();

router.get('/', getAllInitiatives);
router.get('/:id', getSingleInitiative);
router.post('/', updateAllInitiatives);

export default router;
