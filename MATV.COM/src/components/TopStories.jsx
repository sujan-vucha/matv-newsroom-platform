import React from 'react';
import { Play } from 'lucide-react';
import { useTopStoriesData } from '../hooks/useNewsData';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import ArticleModal from './ArticleModal';
import { useState } from 'react';
import AuthorProfile from './AuthorProfile';
import { useNews } from '../hooks/useNews';



const TopStories = () => {
  const { data, loading, error, refetch } = useTopStoriesData();
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
    setIsModalOpen(false); // Use setIsModalOpen instead of setIsArticleModalOpen
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
      <section className="bg-white text-black py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center h-32 md:h-64">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin text-blue-600" />
              <span className="text-base md:text-lg">Loading top stories...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error && !data) {
    return (
      <section className="bg-white text-black py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center h-32 md:h-64">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 md:w-12 md:h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-base md:text-lg font-semibold mb-2">Failed to load top stories</h3>
              <p className="text-sm md:text-base text-gray-600 mb-4 px-4">{error}</p>
              <button 
                onClick={refetch}
                className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
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

  if (!data) return null;

  return (
    <section className="bg-white text-black py-8 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide text-black">National News</h1>
            <div className="flex-1 h-px bg-gradient-to-r from-red-600 to-transparent"></div>
            <div className="flex items-center gap-1 md:gap-2 text-red-600">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-600 rounded-full pulse-dot"></div>
              <span className="text-xs md:text-sm font-semibold">LIVE</span>
            </div>
          </div>
          {error && (
            <div className="mt-2 text-xs md:text-sm text-amber-600 flex items-center gap-2">
              <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
              Using cached data due to API error
            </div>
          )}
        </div>

        {/* Top Row - Main Stories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {data.mainStories.map((story, index) => (
            <div 
              key={story.id || index} 
              className="relative hover-lift cursor-pointer"
              onClick={() => handleArticleClick(story)}
            >
              <div className="relative h-48 sm:h-56 md:h-64 lg:h-80 bg-cover bg-center rounded-xl overflow-hidden mb-3 md:mb-4 shadow-lg"
                   style={{backgroundImage: `url('${story.imageUrl}')`}}>
                <div className="absolute inset-0 gradient-overlay"></div>
                <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3">
                  {story.isEyewitness && (
                    <span className="bg-red-600 text-white px-2 md:px-3 py-1 text-xs md:text-sm font-bold rounded-full mb-2 block">EYEWITNESS</span>
                  )}
                  {index === 1 && (
                    <span className="bg-blue-600 text-white px-2 md:px-3 py-1 text-xs md:text-sm font-bold rounded-full">ANALYSIS</span>
                  )}
                </div>
                {index === 1 && (
                  <div className="absolute bottom-2 md:bottom-3 right-2 md:right-3">
                    <div className="bg-black bg-opacity-50 text-white px-2 md:px-3 py-1 md:py-2 rounded-lg">
                      <span className="text-xs font-bold block">BETH RIGBY</span>
                      <div className="text-xs">POLITICAL EDITOR</div>
                    </div>
                  </div>
                )}
              </div>
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold leading-tight mb-2 md:mb-3 text-black hover:text-red-600 transition-colors">
                {story.title}
              </h2>
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <span className="text-gray-500">2 hours ago</span>
                <span className="text-gray-400">•</span>
                <span className="text-blue-600 font-semibold">{story.category}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Row - Three Stories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {data.bottomStories.map((story, index) => (
            <div 
              key={story.id || index} 
              className="relative news-card-hover cursor-pointer"
              onClick={() => handleArticleClick(story)}
            >
              <div className="relative h-40 sm:h-44 md:h-48 lg:h-56 bg-cover bg-center rounded-xl overflow-hidden mb-3 md:mb-4 shadow-lg"
                   style={{backgroundImage: `url('${story.imageUrl}')`}}>
                <div className="absolute inset-0 gradient-overlay"></div>
                {index === 0 && (
                  <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3">
                    <span className="bg-orange-600 text-white px-2 md:px-3 py-1 text-xs md:text-sm font-bold rounded-full">EXCLUSIVE</span>
                  </div>
                )}
                {index === 2 && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white bg-opacity-90 rounded-full p-2 md:p-3 hover:bg-opacity-100 transition-all">
                        <Play className="w-4 h-4 md:w-6 md:h-6 text-black" fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3">
                      <span className="bg-black bg-opacity-70 text-white px-2 py-1 text-xs font-bold rounded">
                        {story.videoDuration || '2:14'}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <h3 className="text-base md:text-lg font-bold leading-tight mb-2 md:mb-3 text-black hover:text-red-600 transition-colors">
                {story.title}
              </h3>
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <span className="text-gray-500">3 hours ago</span>
                <span className="text-gray-400">•</span>
                <span className="text-blue-600 font-semibold">{story.category}</span>
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

export default TopStories;