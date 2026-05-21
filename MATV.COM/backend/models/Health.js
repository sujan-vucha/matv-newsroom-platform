import mongoose from "mongoose";

const healthSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: String,
  category: String,
  content: String
});

const Health = mongoose.model("Health", healthSchema);
export default Health;
