import mongoose from "mongoose";

const scienceNewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: String,
  category: String,
  content: String
});

const ScienceNews = mongoose.model("ScienceNews", scienceNewsSchema);
export default ScienceNews;
