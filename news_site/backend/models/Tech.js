import mongoose from "mongoose";

const techSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: String,
  category: String,
  content: String
});

const Tech = mongoose.model("Tech", techSchema);
export default Tech;
