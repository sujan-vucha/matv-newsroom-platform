// pages/AllVideos.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';

const AllVideos = () => {
  const [videos, setVideos] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

// video pop model :)
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
      try {
        const res = await api.get('/videos');
        setVideos(Array.isArray(res.data.videos) ? res.data.videos : []);
        setLastUpdated(res.data.lastUpdated);
      } catch (error) {
        console.error('Error fetching videos:', error.message);
        setVideos([]);
      }
    };

    fetchVideos();
  }, []);

  const formatRelativeTime = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} mins ago`;
    if (diffHr === 1) return '1 hour ago';
    if (diffHr < 24) return `${diffHr} hours ago`;
    return date.toLocaleString('en-IN', {
      hour12: true,
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  return (
    <>
    <section className="py-10 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Videos</h1>
        {lastUpdated && (
          <p className="text-sm text-gray-600">
            Last Updated: {formatRelativeTime(lastUpdated)}
          </p>
        )}

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map((video, idx) => (
          <div
            key={idx}
            className="bg-white rounded shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
           onClick={() => {
            setSelectedVideo(video.videoId);
            setShowModal(true);
          }}
          >
            <div className="relative">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              {/* Duration Badge */}
              {video.duration && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-semibold">
                  {formatDuration(video.duration)}
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">{video.title}</h3>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{formatViewCount(video.viewCount)}</span>
                <span>{formatRelativeTime(video.publishedAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>



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

    </>
  );
};

export default AllVideos;
