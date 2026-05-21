import mongoose from "mongoose";

const webStorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: String,
  category: String,
  content: String
});

const WebStory = mongoose.model("WebStory", webStorySchema);
export default WebStory;
