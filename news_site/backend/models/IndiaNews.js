import mongoose from "mongoose";

const indiaNewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: String,
  category: String,
  content: String
});

const IndiaNews = mongoose.model("IndiaNews", indiaNewsSchema);
export default IndiaNews;
