// backend/models/LatestNews.js
import mongoose from "mongoose";

const latestNewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: String,
  category: String,
  content: String
});

const LatestNews = mongoose.model("LatestNews", latestNewsSchema);
export default LatestNews;
             