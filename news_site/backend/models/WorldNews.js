// models/WorldNews.js
import mongoose from 'mongoose';

const newsItemSchema = new mongoose.Schema({
  title: String,
  image: String,
  link: String,
  category: String,
});

const worldNewsSchema = new mongoose.Schema({
  worldNews: [newsItemSchema],
  recommended: [newsItemSchema],
});

const WorldNews = mongoose.model('WorldNews', worldNewsSchema);

export default WorldNews;
