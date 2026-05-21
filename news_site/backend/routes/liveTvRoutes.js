import express from "express";
import { getLiveVideos } from "../controllers/liveTvController.js";

const router = express.Router();

router.get("/", getLiveVideos);

export default router;
