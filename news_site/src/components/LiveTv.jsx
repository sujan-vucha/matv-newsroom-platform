import React, { useEffect, useState, useRef } from 'react';
import api from '../api';

const LiveTv = () => {
  const [currentLive, setCurrentLive] = useState(null);
  const [pastLives, setPastLives] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  // 🆕 New State
  const [source, setSource] = useState('');
  const [videoCount, setVideoCount] = useState(0);


  // video model
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const videoRef = useRef(null);
  const [showGoLive, setShowGoLive] = useState(false);
  const [isLive, setIsLive] = useState(true);



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
    const fetchLiveData = async () => {
      try {
        const res = await api.get('/live-tv');
        console.log('Live TV API Response:', res.data);

        setCurrentLive(res.data.currentLive);
        setPastLives(Array.isArray(res.data.pastLives) ? res.data.pastLives : []);
        setLastUpdated(res.data.lastUpdated);

        // 🆕 Set source and count
        setSource(res.data.source || 'unknown');
        setVideoCount(res.data.count || 0);
      } catch (error) {
        console.error('Error fetching live TV:', error.message);
        setCurrentLive(null);
        setPastLives([]);
        setSource('error');
        setVideoCount(0);
      }
    };

    fetchLiveData();
    
    // Load HLS.js for M3U8 support
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
    script.onload = () => {
      if (window.Hls && videoRef.current) {
        const hls = new window.Hls();
        hls.loadSource('https://ap02.iqplay.tv:8082/iqb8002/m1t2/playlist.m3u8');
        hls.attachMedia(videoRef.current);
        
        const checkLiveStatus = () => {
          if (videoRef.current) {
            const currentTime = videoRef.current.currentTime;
            const duration = videoRef.current.duration;
            const timeBehind = duration - currentTime;
            
            if (timeBehind > 20) {
              setShowGoLive(true);
              setIsLive(false);
            } else {
              setShowGoLive(false);
              setIsLive(true);
            }
          }
        };
        
        videoRef.current.addEventListener('timeupdate', checkLiveStatus);
      }
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    // Hide video timer with CSS
    const style = document.createElement('style');
    style.textContent = `
      video::-webkit-media-controls-current-time-display,
      video::-webkit-media-controls-time-remaining-display {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const goToLive = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = videoRef.current.duration;
      videoRef.current.play();
      setShowGoLive(false);
      setIsLive(true);
    }
  };

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

  return (

    <>
    <section className="py-10 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Live TV</h1>
        <div className="text-right text-sm text-gray-600">
          <div className="flex items-center justify-end">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-green-600 font-medium">LIVE</span>
          </div>
        </div>
      </div>

      {/* MATV Television Section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-red-600">MATV Television</h2>
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg shadow-lg overflow-hidden">
          <div className="aspect-video bg-black relative max-w-4xl mx-auto">
            <video
              ref={videoRef}
              className="w-full h-full"
              controls
              muted
              playsInline
              style={{
                '&::-webkit-media-controls-current-time-display': { display: 'none' },
                '&::-webkit-media-controls-time-remaining-display': { display: 'none' }
              }}
            >
              Your browser does not support the video tag or HLS streaming.
            </video>
            {showGoLive && (
              <button
                onClick={goToLive}
                className="absolute bottom-16 right-4 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg"
              >
                Go to Live
              </button>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-bold text-red-600">MATV Live Stream</h3>
            <p className="text-sm text-gray-600">Watch MATV Television live 24/7</p>
            <div className="flex items-center mt-2">
              <div className={`w-2 h-2 rounded-full mr-2 ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className={`text-xs font-medium ${isLive ? 'text-red-600' : 'text-gray-500'}`}>
                {isLive ? 'LIVE' : 'BEHIND LIVE'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">YouTube Live</h2>
        {currentLive ? (
          <div
            className="bg-red-100 rounded shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition"
            onClick={() => {
            setSelectedVideo(currentLive.videoId);
            setShowModal(true);
          }}

          >
            <img
              src={currentLive.thumbnail}
              alt={currentLive.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold text-red-600">{currentLive.title}</h3>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-xs text-red-600 font-medium">LIVE</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 italic">No live video right now</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Past Lives</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {pastLives.map((video, idx) => (
            <div
              key={idx}
              className="bg-white rounded shadow-lg overflow-hidden cursor-pointer hover:shadow-xl"
              onClick={() => {
                setSelectedVideo(video.videoId);
                setShowModal(true);
              }}

            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-800">{video.title}</h3>
                <p className="text-xs text-gray-500">{formatRelativeTime(video.publishedAt)}</p>
              </div>
            </div>
          ))}
        </div>
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

export default LiveTv;
