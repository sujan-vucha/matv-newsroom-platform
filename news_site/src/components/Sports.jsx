import React, { useState, useEffect } from 'react';
import {
  Trophy, Play, Clock, Eye, Heart,
  Share2, Loader2, AlertCircle, RefreshCw
} from 'lucide-react';
import { useSportsData } from '../hooks/useSports';
import { useSports } from '../store/sportsStore';
import ArticleModal from './ArticleModal';
import AuthorProfile from './AuthorProfile';
import { useNews } from '../hooks/useNews';







const Sports = () => {
  const { data: sportsData, loading, error, refetch } = useSportsData();
  const { getNewsByCategory, getCategories } = useSports();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likedArticles, setLikedArticles] = useState(new Set());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


 const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [showAuthorProfile, setShowAuthorProfile] = useState(false)



  const categories = sportsData ? getCategories() : ['All'];
  const filteredNews = sportsData ? getNewsByCategory(selectedCategory) : [];







  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  const handleLike = (articleId) => {
    setLikedArticles(prev => {
      const newSet = new Set(prev);
      newSet.has(articleId) ? newSet.delete(articleId) : newSet.add(articleId);
      return newSet;
    });
  };

  const handleShare = (article) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };





  // Use the news store hook
  const { articles, featuredArticle, trendingTopics,  fetchArticles } = useNews();

  // Force fetch articles if they're empty
  React.useEffect(() => {
    if (articles.length === 0 && !loading) {
      fetchArticles();
    }
  }, [articles.length, loading, fetchArticles]);

  

  const handleAuthorClick = (authorName) => {
    setSelectedAuthor({ name: authorName });
    setShowAuthorProfile(true);
    setIsArticleModalOpen(false);
  };

  const handleBackToNews = () => {
    setShowAuthorProfile(false);
    setSelectedAuthor(null);
  };


  // Show author profile page
  if (showAuthorProfile) {
    return (
      <AuthorProfile 
        author={selectedAuthor}
        onBack={handleBackToNews}
      />
    );
  }
















  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-red-600" />
            <span className="text-lg">Loading sports content...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error && !sportsData) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load sports content</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="flex items-center gap-2 mx-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="max-w-7xl mx-auto px-6 py-16 bg-gradient-to-br from-gray-50 to-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-red-600 p-3 rounded-xl shadow-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-black tracking-wide">SPORTS</h2>
              <p className="text-gray-600 mt-1">Live scores, breaking news & analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Last updated: {currentTime.toLocaleTimeString()}</span>
            {error && (
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="w-4 h-4" />
                <span>Using cached data</span>
              </div>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-red-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300 hover:text-red-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Main Featured */}
          <div>
            {filteredNews.length > 0 && (
              <div
                className="group relative overflow-hidden rounded-2xl shadow-2xl mb-8 cursor-pointer transform transition-all duration-500 hover:-translate-y-2"
                onClick={() => handleArticleClick(filteredNews[0])}
              >
                <div className="relative h-96">
                  <img
                    src={filteredNews[0].img}
                    alt={filteredNews[0].title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg">
                      {filteredNews[0].tags?.[0] || 'News'}

                    </span>
                  </div>
                  {filteredNews[0].isLive && (
                    <div className="absolute top-6 right-6">
                      <span className="bg-red-600 text-white px-3 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        LIVE
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-white text-3xl font-bold mb-3 leading-tight group-hover:text-red-300 transition-colors">
                      {filteredNews[0].title}
                    </h3>
                    <p className="text-gray-200 text-lg mb-4 line-clamp-2">
                      {filteredNews[0].summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-white/80">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{filteredNews[0].timeAgo}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">{filteredNews[0].views}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(filteredNews[0].id);
                          }}
                          className={`flex items-center gap-1 px-3 py-2 rounded-full transition-all ${
                            likedArticles.has(filteredNews[0].id)
                              ? 'bg-red-600 text-white'
                              : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${likedArticles.has(filteredNews[0].id) ? 'fill-current' : ''}`} />
                          <span className="text-sm">{filteredNews[0].likes + (likedArticles.has(filteredNews[0].id) ? 1 : 0)}</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(filteredNews[0]);
                          }}
                          className="flex items-center gap-1 px-3 py-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-red-600 bg-opacity-90 rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform">
                      <Play className="w-8 h-8 text-white" fill="currentColor" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredNews.slice(1).map((news) => (
                <div
                  key={news.id}
                  onClick={() => handleArticleClick(news)}
                  className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={news.imageUrl || news.img}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                        {news.tags?.[0] || 'News'}

                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 text-black group-hover:text-red-600 transition-colors line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{news.summary}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{news.timeAgo}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{news.views}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(news.id);
                          }}
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all ${
                            likedArticles.has(news.id)
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                          }`}
                        >
                          <Heart className={`w-3 h-3 ${likedArticles.has(news.id) ? 'fill-current' : ''}`} />
                          <span>{news.likes + (likedArticles.has(news.id) ? 1 : 0)}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ArticleModal 
      article={selectedArticle} 
      isOpen={isModalOpen} 
      
      onClose={handleCloseModal}
      onAuthorClick={handleAuthorClick}
       />
    </>
  );
};

export default Sports;
