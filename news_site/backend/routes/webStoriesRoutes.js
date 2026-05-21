import express from 'express';
import {
  getAllWebStories,
  getSingleWebStory,
  updateAllWebStories
} from '../controllers/webStoriesController.js';

const router = express.Router();

// Public routes
router.get('/', getAllWebStories);
router.get('/:id', getSingleWebStory);

// Admin-only route
router.post('/', updateAllWebStories);

export default router;
