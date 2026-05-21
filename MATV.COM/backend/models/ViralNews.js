import mongoose from "mongoose";

const viralNewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: String,
  category: String,
  content: String
});


const ViralNews = mongoose.model("ViralNews", viralNewsSchema);
export default ViralNews;
