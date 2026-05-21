import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight, BookOpen, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useDeepDiveData } from '../hooks/useDeepDive';
import ArticleModal from './ArticleModal';
import { useState } from 'react';
import AuthorProfile from './AuthorProfile';
import { useNews } from '../hooks/useNews';





const DeepDive = () => {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useDeepDiveData();
  const [selectedArticle, setSelectedArticle] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);


 const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [showAuthorProfile, setShowAuthorProfile] = useState(false)

  
  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  const handleViewAll = () => {
    navigate('/deep-dive');
  };





;
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
      <section className="bg-white text-black py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-lg">Loading deep dive stories...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error && !data) {
    return (
      <section className="bg-white text-black py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to load deep dive stories</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={refetch}
                className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!data || data.length === 0) return null;

  // Ensure exactly 4 cards
  const cards = data.slice(0, 4);

  return (
    <section className="bg-gradient-to-br from-slate-50 to-gray-100 text-black py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-3xl font-bold text-black tracking-wide">DEEP DIVE</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-red-600 to-transparent"></div>
          </div>
        </div>

        {error && (
          <div className="mb-6 text-sm text-amber-600 flex items-center gap-2 bg-amber-50 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            Using cached data due to API error
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((item, index) => (
            <div
              key={item._id}
              onClick={() => handleArticleClick(item)}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02]"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img
                  src={item.img || "https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=800"}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                    {item.category}
                  </span>
                </div>

                {/* Read Time Badge */}
                {item.readTime && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.readTime}
                    </span>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white bg-opacity-90 text-gray-900 px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
                    Read Full Story
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-bold text-gray-900 text-lg leading-tight mb-3 group-hover:text-orange-600 transition-colors duration-300 line-clamp-2">
                  {item.title}
                </h3>
                
                {item.summary && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                )}

                {/* Meta Information */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span>{item.timeAgo}</span>
                  </div>
                  {item.author && (
                    <span className="font-medium text-gray-700">{item.author}</span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        
      </div>
      
      <ArticleModal 
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAuthorClick={handleAuthorClick}
      />
    </section>
  );
};

export default DeepDive;