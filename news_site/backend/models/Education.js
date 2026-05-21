import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: String,
  category: String,
  content: String
});

const Education = mongoose.model("Education", educationSchema);
export default Education;
