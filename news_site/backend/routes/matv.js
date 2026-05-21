// backend/routes/matv.js
import express from 'express';
import { updateMatv, getMatv } from '../controllers/matvController.js';

const router = express.Router();

router.post('/update', updateMatv);
router.get('/latest', getMatv);

export default router;
