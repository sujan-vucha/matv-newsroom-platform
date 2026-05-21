// models/Homepage.js
import mongoose from 'mongoose'

const homepageSchema = new mongoose.Schema({
  headline: String,
  mainImage: String,
  trendingTopics: [String]
})

export default mongoose.model('Homepage', homepageSchema)
