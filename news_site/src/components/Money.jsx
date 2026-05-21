import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Clock, ArrowRight, Loader2, AlertCircle, RefreshCw, DollarSign } from 'lucide-react';
import { useMoneyData } from '../hooks/useMoney';
import ArticleModal from './ArticleModal';
import { useState } from 'react';
import AuthorProfile from './AuthorProfile';
import { useNews } from '../hooks/useNews';

const Money = () => {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useMoneyData();
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
    navigate('/money');
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
      <section className="bg-white text-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
              <span className="text-lg">Loading money stories...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error && !data) {
    return (
      <section className="bg-white text-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to load money stories</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={refetch}
                className="flex items-center gap-2 mx-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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

  // Get first 3 stories for display
  const featuredStories = data.slice(0, 3);

  return (
    <section className="bg-gradient-to-br from-green-50 to-emerald-50 text-black py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 text-white p-2 rounded-lg">
                <DollarSign className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-black tracking-wide">MONEY</h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-green-600 to-transparent"></div>
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-semibold">FINANCIAL NEWS</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 text-sm text-amber-600 flex items-center gap-2 bg-amber-50 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            Using cached data due to API error
          </div>
        )}

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {featuredStories.map((story, index) => (
        
            <div
              key={story.id}
              

              onClick={() => handleArticleClick(story)}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02]"
            >
          
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img
                  src={story.imageUrl}
                  alt={story.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                    {story.category}
                  </span>
                </div>

                {/* Featured Badge for first story */}
                {index === 0 && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      ⭐ FEATURED
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
                <h3 className="font-bold text-gray-900 text-lg leading-tight mb-3 group-hover:text-green-600 transition-colors duration-300 line-clamp-2">
                  {story.title}
                </h3>
                
                {story.summary && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {story.summary}
                  </p>
                )}

                {/* Meta Information */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span>{story.timeAgo}</span>
                  </div>
                  {story.author && (
                    <span className="font-medium text-gray-700">{story.author}</span>
                  )}
                </div>

                {/* Tags */}
              {story.tags && (
              <div className="flex flex-wrap gap-1 mb-4">
               {story.tags.slice(0, 2).map((tag, idx) => (
                      <span 
                        key={`${story.id}-${tag}-${idx}`} 
                        className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        #{tag}
                      </span>
                    ))}

              </div>
            )}


                {/* Progress Bar */}
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

      
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

export default Money;