import React, { useState, useEffect } from 'react';
import {
  Cpu, Smartphone, Zap, TrendingUp, Eye, Heart, Share2, Clock,
  Loader2, AlertCircle, RefreshCw, Sparkles
} from 'lucide-react';
import { useTechnologyData, useTechnologyStats } from '../hooks/useTechnology';
import { useTechnology } from '../store/technologyStore';
import ArticleModal from './ArticleModal';
import AuthorProfile from './AuthorProfile';
// (Optional) You had useNews here but it’s not used for Technology rendering now.
// import { useNews } from '../hooks/useNews';

const Technology = () => {
  const { data: technologyData, loading, error, refetch } = useTechnologyData();
  const { stats } = useTechnologyStats();
  const { getStoriesByCategory, getCategories, getAllStories } = useTechnology();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likedArticles, setLikedArticles] = useState(new Set());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [showAuthorProfile, setShowAuthorProfile] = useState(false);

  // Categories & stories from store
  const categories = technologyData ? getCategories() : ['All'];

  const allStories = getAllStories();
  const filteredStories =
    selectedCategory === 'All'
      ? allStories
      : getStoriesByCategory(selectedCategory);

  // ✅ pick a featured story properly
  const featuredStory =
    filteredStories.find(s => s?.isFeatured) ||
    filteredStories.find(s => s?.isBreaking) ||
    filteredStories[0] ||
    null;

  // ✅ compare by id (not _id)
  const regularStories = featuredStory
    ? filteredStories.filter(s => s && s.id !== featuredStory.id)
    : filteredStories;

  // Update current time every minute
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
      const next = new Set(prev);
      next.has(articleId) ? next.delete(articleId) : next.add(articleId);
      return next;
    });
  };
  const handleShare = (article) => {
    if (navigator.share) {
      navigator.share({ title: article.title, text: article.summary, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleAuthorClick = (authorName) => {
    setSelectedAuthor({ name: authorName });
    setShowAuthorProfile(true);
  };
  const handleBackToNews = () => {
    setShowAuthorProfile(false);
    setSelectedAuthor(null);
  };

  if (showAuthorProfile) {
    return <AuthorProfile author={selectedAuthor} onBack={handleBackToNews} />;
  }

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-red-600" />
            <span className="text-base md:text-lg">Loading technology content...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error && !technologyData) {
    return (
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load technology content</h3>
            <p className="text-gray-600 mb-4 text-sm md:text-base">{error}</p>
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
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-4 overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 md:p-3 rounded-xl shadow-lg">
              <Cpu className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-black tracking-wide">Entertrainment</h2>
              <p className="text-gray-600 mt-1 text-sm md:text-base">Innovation, breakthroughs & digital transformation</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs md:text-sm text-gray-500">
            <Smartphone className="w-5 h-5 text-red-600" />
            <Zap className="w-5 h-5 text-red-600" />
            <Sparkles className="w-5 h-5 text-red-600" />
            <div className="flex items-center gap-2">
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
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow border">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg"><TrendingUp className="w-5 h-5 text-red-600" /></div>
              <div>
                <p className="text-xs text-gray-600">Total Articles</p>
                <p className="text-xl font-bold text-black">{stats?.totalArticles ?? getAllStories().length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow border">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg"><Eye className="w-5 h-5 text-blue-600" /></div>
              <div>
                <p className="text-xs text-gray-600">Weekly Views</p>
                <p className="text-xl font-bold text-black">{stats?.weeklyViews || 'N/A'}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow border">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg"><Sparkles className="w-5 h-5 text-green-600" /></div>
              <div>
                <p className="text-xs text-gray-600">Trending</p>
                <p className="text-sm font-bold text-black">{stats?.trending || (categories[1] || 'N/A')}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow border">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg"><Cpu className="w-5 h-5 text-purple-600" /></div>
              <div>
                <p className="text-xs text-gray-600">Top Category</p>
                <p className="text-sm font-bold text-black">{stats?.topCategory || 'Entertainment'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap text-sm md:text-base transition-all ${
                selectedCategory === category
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300 hover:text-red-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Story */}
          {featuredStory && (
            <div
              className="group relative overflow-hidden rounded-2xl shadow-2xl cursor-pointer transition-transform hover:-translate-y-2"
              onClick={() => handleArticleClick(featuredStory)}
            >
              <div className="relative h-[350px] md:h-[500px]">
                <img
                  src={featuredStory.imageUrl}
                  alt={featuredStory.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                {featuredStory.isBreaking && (
                  <div className="absolute top-6 left-6">
                    <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      BREAKING
                    </span>
                  </div>
                )}

                <div className="absolute top-6 right-6">
                  <span className="bg-black/70 text-white px-3 py-2 rounded-full text-sm font-bold">
                    {featuredStory.tags?.[0] || 'News'}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="mb-4">
                    <span className="text-red-400 font-semibold text-lg">{featuredStory.category}</span>
                  </div>

                  <h3 className="text-white text-3xl font-bold mb-4 leading-tight group-hover:text-red-300 transition-colors">
                    {featuredStory.title}
                  </h3>

                  <p className="text-gray-200 text-lg mb-6 line-clamp-2">{featuredStory.summary}</p>

                  <div className="flex items-center justify-between text-white/80 text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{featuredStory.timeAgo}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>{featuredStory.views}</span>
                      </div>
                      {featuredStory.readTime && <span>{featuredStory.readTime}</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleLike(featuredStory.id); }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-all ${
                          likedArticles.has(featuredStory.id) ? 'bg-red-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${likedArticles.has(featuredStory.id) ? 'fill-current' : ''}`} />
                        <span>{featuredStory.likes + (likedArticles.has(featuredStory.id) ? 1 : 0)}</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleShare(featuredStory); }}
                        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Side Stories */}
          <div className="space-y-6">
            {regularStories.slice(0, 3).map((story) => (
              <div
                key={story.id}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
                onClick={() => handleArticleClick(story)}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-48 h-48 flex-shrink-0">
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                        {story.tags?.[0] || 'News'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1">
                    <h3 className="font-bold text-xl mb-3 text-black group-hover:text-red-600 transition-colors line-clamp-2">
                      {story.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{story.summary}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1"><Clock className="w-4 h-4" /><span>{story.timeAgo}</span></div>
                        <div className="flex items-center gap-1"><Eye className="w-4 h-4" /><span>{story.views}</span></div>
                        {story.readTime && <span>{story.readTime}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleLike(story.id); }}
                          className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs transition-all ${
                            likedArticles.has(story.id)
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${likedArticles.has(story.id) ? 'fill-current' : ''}`} />
                          <span>{story.likes + (likedArticles.has(story.id) ? 1 : 0)}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Stories */}
        {regularStories.length > 3 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-black mb-6">More Technology News</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularStories.slice(3).map((story) => (
                <div
                  key={story.id}
                  className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
                  onClick={() => handleArticleClick(story)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-3 left-3">
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                        {story.tags?.[0] || 'News'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 text-black group-hover:text-red-600 transition-colors line-clamp-2">
                      {story.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{story.summary}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1"><Clock className="w-4 h-4" /><span>{story.timeAgo}</span></div>
                        <div className="flex items-center gap-1"><Eye className="w-4 h-4" /><span>{story.views}</span></div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleLike(story.id); }}
                        className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs transition-all ${
                          likedArticles.has(story.id)
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${likedArticles.has(story.id) ? 'fill-current' : ''}`} />
                        <span>{story.likes + (likedArticles.has(story.id) ? 1 : 0)}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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

export default Technology;
