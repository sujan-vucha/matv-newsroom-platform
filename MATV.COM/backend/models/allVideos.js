import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  videoId: { type: String, unique: true },
  title: String,
  description: String,
  thumbnail: String,
  publishedAt: Date,
  channelId: String,
  viewCount: { type: String, default: '0' },
  likeCount: { type: String, default: '0' },
  duration: { type: String, default: 'PT0S' }
});

const AllVideo = mongoose.model("AllVideo", videoSchema);
export default AllVideo;
