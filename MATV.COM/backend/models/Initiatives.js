import mongoose from "mongoose";

const initiativesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: String,
  category: String,
  content: String
});

const Initiatives = mongoose.model("Initiatives", initiativesSchema);
export default Initiatives;