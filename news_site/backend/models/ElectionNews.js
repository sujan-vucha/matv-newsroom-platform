import mongoose from "mongoose";

const electionNewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: String,
  category: String,
  content: String
});

const ElectionNews = mongoose.model("ElectionNews", electionNewsSchema);
export default ElectionNews;
