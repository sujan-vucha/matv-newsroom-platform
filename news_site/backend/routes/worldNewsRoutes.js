import express from 'express';
import { getWorldNews, updateWorldNews } from '../controllers/worldNewsController.js';

const router = express.Router();

router.get('/', getWorldNews);
router.post('/', updateWorldNews);

export default router;
