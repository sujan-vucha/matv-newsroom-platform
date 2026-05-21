import axios from "axios";
import AllVideo from "../models/allVideos.js";
import dotenv from 'dotenv';

dotenv.config();

let lastFetchTime = null;

export const getAllVideos = async (req, res) => {
  try {
    const now = new Date();
    const shouldFetchFromYouTube = !lastFetchTime || (now - lastFetchTime) > 5 * 60 * 1000;

    if (shouldFetchFromYouTube) {
      console.log('⏱️ 5+ mins passed — Fetching fresh videos from YouTube API...');

      // First, get the uploads playlist ID for the channel
      const channelRes = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
        params: {
          part: 'contentDetails',
          id: process.env.YOUTUBE_CHANNEL_ID,
          key: process.env.YOUTUBE_API_KEY
        }
      });

      const uploadsPlaylistId = channelRes.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

      if (!uploadsPlaylistId) {
        return res.status(500).json({ message: 'Failed to get uploads playlist ID' });
      }

      // Then, fetch videos from that uploads playlist
      const playlistRes = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
        params: {
          part: 'snippet',
          playlistId: uploadsPlaylistId,
          maxResults: 50,
          key: process.env.YOUTUBE_API_KEY
        }
      });

      console.log('YouTube API returned:', playlistRes.data.items.length, 'videos');
      
      // Get video IDs for statistics fetch
      const videoIds = playlistRes.data.items.map(item => item.snippet.resourceId.videoId).join(',');
      
      // Fetch video statistics (views, likes, etc.)
      const statsRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'statistics,contentDetails',
          id: videoIds,
          key: process.env.YOUTUBE_API_KEY
        }
      });
      
      // Create a map of video statistics
      const statsMap = {};
      console.log('📊 Statistics API returned:', statsRes.data.items.length, 'video stats');
      statsRes.data.items.forEach(item => {
        console.log(`Video ${item.id}: ${item.statistics?.viewCount || '0'} views`);
        statsMap[item.id] = {
          viewCount: item.statistics?.viewCount || '0',
          likeCount: item.statistics?.likeCount || '0',
          duration: item.contentDetails?.duration || 'PT0S'
        };
      });
      
      const newVideos = playlistRes.data.items.map(item => {
        const videoId = item.snippet.resourceId.videoId;
        const stats = statsMap[videoId] || { viewCount: '0', likeCount: '0', duration: 'PT0S' };
        
        const video = {
          videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails?.high?.url || '',
          publishedAt: item.snippet.publishedAt,
          channelId: item.snippet.channelId,
          viewCount: stats.viewCount || '0',
          likeCount: stats.likeCount || '0',
          duration: stats.duration || 'PT0S'
        };
        
        console.log(`💾 Saving video: ${video.title} - ${video.viewCount} views`);
        return video;
      });

      // Clear existing videos and insert new ones to update view counts
      await AllVideo.deleteMany({});
      await AllVideo.insertMany(newVideos);
      console.log(`✅ Saved ${newVideos.length} videos to database`);

      lastFetchTime = now;
    } else {
      console.log('🗂️ Using cached videos from MongoDB');
    }

    const videos = await AllVideo.find().sort({ publishedAt: -1 }).limit(50);
    console.log(`📤 Returning ${videos.length} videos to frontend`);
    if (videos.length > 0) {
      console.log(`First video: ${videos[0].title} - ${videos[0].viewCount} views`);
    }
    res.status(200).json({
      videos,
      lastUpdated: lastFetchTime || new Date()
    });
  } catch (error) {
    console.error("Error in getting videos:", error.message);
    res.status(500).json({ message: "Server error fetching videos" });
  }
};