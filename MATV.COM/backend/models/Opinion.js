import mongoose from "mongoose";

const opinionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: String,
  category: String,
  content: String
});

const Opinion = mongoose.model("Opinion", opinionSchema);
export default Opinion;
