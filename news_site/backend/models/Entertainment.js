import mongoose from "mongoose";

const entertainmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: String,
  category: String,
  content: String
});

const Entertainment = mongoose.model("Entertainment", entertainmentSchema);
export default Entertainment;
