import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ExternalLink, Loader2, AlertCircle, Youtube } from 'lucide-react';

const WatchLatestVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showModal, setShowModal] = useState(false);



useEffect(() => {
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      setShowModal(false);
      setSelectedVideo(null);
    }
  };
  window.addEventListener('keydown', handleEsc);
  return () => window.removeEventListener('keydown', handleEsc);
}, []);




  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);

      // Clear old cache to force fresh fetch
      localStorage.removeItem('youtube_videos');
      localStorage.removeItem('youtube_videos_timestamp');

      try {
        // Use backend API instead of direct YouTube API
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
        const response = await fetch(`${backendUrl}/api/videos`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch videos from backend');
        }
        
        const data = await response.json();
        const videoList = data.videos.map(video => ({
          title: video.title,
          videoId: video.videoId,
          thumbnail: video.thumbnail,
          publishedAt: video.publishedAt,
          description: video.description,
          channelTitle: 'MATV',
          viewCount: video.viewCount || '0',
          likeCount: video.likeCount || '0',
          duration: video.duration || 'PT0S'
        }));

        console.log('📺 Fetched videos from backend:', videoList.length);
        if (videoList.length > 0) {
          console.log('First video views:', videoList[0].viewCount);
        }

        setVideos(videoList);
        localStorage.setItem('youtube_videos', JSON.stringify(videoList));
        localStorage.setItem('youtube_videos_timestamp', Date.now().toString());
      } catch (err) {
        console.error('Failed to fetch videos from backend:', err.message);
        setError(err.message);
        setMockVideos();
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const setMockVideos = () => {
    const mockVideos = [
      {
        title: 'Breaking: Global Climate Summit Reaches Historic Agreement',
        videoId: 'mock-video-1',
        thumbnail: 'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=800',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        description: 'World leaders unite on climate action',
        channelTitle: 'GlobalNews',
        viewCount: '125000',
        likeCount: '2500',
        duration: 'PT5M30S'
      },
      {
        title: 'Tech Innovation: AI Breakthrough in Medical Research',
        videoId: 'mock-video-2',
        thumbnail: 'https://images.pexels.com/photos/8828687/pexels-photo-8828687.jpeg?auto=compress&cs=tinysrgb&w=800',
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        description: 'Revolutionary AI system transforms healthcare',
        channelTitle: 'GlobalNews',
        viewCount: '89000',
        likeCount: '1800',
        duration: 'PT8M15S'
      },
      {
        title: 'Economic Update: Markets React to Federal Reserve Decision',
        videoId: 'mock-video-3',
        thumbnail: 'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=800',
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        description: 'Analysis of market movements and economic trends',
        channelTitle: 'GlobalNews',
        viewCount: '67000',
        likeCount: '1200',
        duration: 'PT6M45S'
      },
      {
        title: 'Space Exploration: New Discoveries from Mars Mission',
        videoId: 'mock-video-4',
        thumbnail: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800',
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        description: 'Latest findings from the Mars exploration mission',
        channelTitle: 'GlobalNews',
        viewCount: '156000',
        likeCount: '3200',
        duration: 'PT10M22S'
      }
    ];
    setVideos(mockVideos);
  };

  const formatTimeAgo = (publishedAt) => {
    const now = new Date();
    const published = new Date(publishedAt);
    const diffInHours = Math.floor((now - published) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const formatDuration = (duration) => {
    if (!duration || duration === 'PT0S') return '0:00';
    
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatViewCount = (viewCount) => {
    if (!viewCount || viewCount === '0') return '0 views';
    
    const count = parseInt(viewCount);
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`;
    }
    return `${count.toLocaleString()} views`;
  };

  const handleVideoClick = (video) => {
    if (video.videoId.startsWith('mock-')) {
      // For mock videos, just show an alert
      alert('This is a demo video. In production, this would open the actual YouTube video.');
      return;
    }
   setSelectedVideo(video.videoId);
    setShowModal(true);

  };

  const recentVideos = videos.slice(0, 4);

  if (loading) {
    return (
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3 text-gray-600">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-lg">Loading latest videos...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Youtube className="w-8 h-8 text-red-600" />
              <h2 className="text-3xl font-bold text-black tracking-wide">
                WATCH LATEST VIDEOS
              </h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-red-600 to-transparent"></div>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-amber-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Using demo content</span>
            </div>
          )}
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {recentVideos.map((video, idx) => (
            <div
              key={video.videoId || idx}
              className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:scale-105"
              onClick={() => handleVideoClick(video)}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                {/* Thumbnail Container */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white bg-opacity-90 rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Play className="w-8 h-8 text-red-600" fill="currentColor" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-semibold">
                    {formatDuration(video.duration)}
                  </div>

                  {/* Live Badge for recent videos */}
                  {idx === 0 && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      NEW
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {video.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-medium">{video.channelTitle || 'GlobalNews'}</span>
                    <span>{formatTimeAgo(video.publishedAt)}</span>
                  </div>

                  {/* Real view count */}
                  <div className="mt-2 text-xs text-gray-400">
                    {formatViewCount(video.viewCount)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>







{showModal && selectedVideo && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div className="relative w-full max-w-3xl aspect-video bg-black rounded-xl shadow-xl">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-xl"
      ></iframe>
      <button
        className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-80 transition"
        onClick={() => {
          setShowModal(false);
          setSelectedVideo(null);
        }}
      >
        ✖
      </button>
    </div>
  </div>
)}









        {/* View More Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/videos')}
            className="inline-flex items-center gap-2 bg-red-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-red-700 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
          >
            <span>View All Videos</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default WatchLatestVideos;