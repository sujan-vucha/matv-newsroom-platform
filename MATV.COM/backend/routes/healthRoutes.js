import express from 'express';
import {
  getAllHealth,
  getSingleHealth,
  updateAllHealth
} from '../controllers/healthController.js';

const router = express.Router();

router.get('/', getAllHealth);
router.get('/:id', getSingleHealth);
router.post('/', updateAllHealth);

export default router;
