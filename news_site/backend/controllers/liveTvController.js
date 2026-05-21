import axios from "axios";
import LiveVideo from "../models/liveVideo.js";
import dotenv from "dotenv";

dotenv.config();

let lastFetchTime = null;

export const getLiveVideos = async (req, res) => {
  try {
    const now = new Date();
    const shouldFetchFromYouTube = !lastFetchTime || (now - lastFetchTime) > 10 * 60 * 1000;

    if (shouldFetchFromYouTube) {
      console.log("⏱️ 10+ mins passed — Fetching fresh live videos from YouTube API...");

      const channelId = process.env.YOUTUBE_CHANNEL_ID;
      const apiKey = process.env.YOUTUBE_API_KEY;

      // Step 1: Get uploads playlist
      const channelRes = await axios.get("https://www.googleapis.com/youtube/v3/channels", {
        params: {
          part: "contentDetails",
          id: channelId,
          key: apiKey,
        },
      });

      const uploadsPlaylistId = channelRes.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
      if (!uploadsPlaylistId) {
        return res.status(500).json({ message: "Failed to get uploads playlist ID" });
      }

      // Step 2: Fetch latest 20 videos from that playlist
      const playlistRes = await axios.get("https://www.googleapis.com/youtube/v3/playlistItems", {
        params: {
          part: "snippet",
          playlistId: uploadsPlaylistId,
          maxResults: 20,
          key: apiKey,
        },
      });

      const videoItems = playlistRes.data.items;
      const videoIds = videoItems.map(item => item.snippet.resourceId.videoId);

      // Step 3: Get liveStreamingDetails
      const videoRes = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
        params: {
          part: "snippet,liveStreamingDetails",
          id: videoIds.join(","),
          key: apiKey,
        },
      });

      const currentLive = [];
      const pastLives = [];

      videoRes.data.items.forEach(item => {
        const liveDetails = item.liveStreamingDetails;
        const isLive = !!(liveDetails?.actualStartTime && !liveDetails.actualEndTime);

        const videoData = {
          videoId: item.id,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails?.high?.url || "",
          publishedAt: item.snippet.publishedAt,
          channelId: item.snippet.channelId,
          isLive,
        };

        if (isLive) currentLive.push(videoData);
        else if (liveDetails?.actualEndTime) pastLives.push(videoData);
      });

      // Save videos to DB
      const allVideosToInsert = [...(currentLive.length ? [currentLive[0]] : []), ...pastLives];
      await LiveVideo.insertMany(allVideosToInsert, { ordered: false }).catch(() =>
        console.log("Some live videos already exist in DB. Skipping duplicates.")
      );

      lastFetchTime = now;
    } else {
      console.log("🗂️ Using cached live videos from MongoDB");
    }

    // Always read from DB
    const allVideos = await LiveVideo.find().sort({ publishedAt: -1 }).limit(20);
    const currentLive = allVideos.find(v => v.isLive === true) || null;
    const pastLives = allVideos.filter(v => v.isLive === false);

    res.status(200).json({
  source: shouldFetchFromYouTube ? "YouTube" : "MongoDB",
  currentLive,
  pastLives,
  count: (currentLive ? 1 : 0) + pastLives.length,
  lastUpdated: lastFetchTime || new Date(),
});
  } catch (error) {
    console.error("❌ Error fetching live videos:", error.message);
    res.status(500).json({ message: "Server error fetching live videos" });
  }
};
