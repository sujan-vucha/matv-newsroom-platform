import mongoose from "mongoose";

const defenceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: String,
  category: String,
  content: String
});

const Defence = mongoose.model("Defence", defenceSchema);
export default Defence;
