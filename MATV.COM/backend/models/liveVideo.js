import mongoose from "mongoose";

const liveVideoSchema = new mongoose.Schema({
  videoId: {
    type: String,
    unique: true, // ✅ Prevent duplicates
    required: true,
  },
  title: String,
  description: String,
  thumbnail: String,
  publishedAt: Date,
  channelId: String,
  isLive: Boolean,
});

export default mongoose.model("LiveVideo", liveVideoSchema);
