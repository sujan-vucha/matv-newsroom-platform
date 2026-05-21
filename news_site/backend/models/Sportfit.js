import mongoose from "mongoose";

const sportfitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: String,
  category: String,
  content: String
});

const Sportfit = mongoose.model("Sportfit", sportfitSchema);
export default Sportfit;
