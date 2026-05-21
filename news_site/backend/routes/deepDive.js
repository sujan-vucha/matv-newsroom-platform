import express from 'express';
import {
  getAllDeepDives,
  getDeepDiveById,
  updateDeepDive,
} from '../controllers/deepDiveController.js';

const router = express.Router();

router.get('/', getAllDeepDives);
router.get('/:id', getDeepDiveById);
router.put('/:id', updateDeepDive);

export default router;
