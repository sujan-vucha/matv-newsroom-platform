import React from 'react';
import { useMoreToExploreData } from '../hooks/useNewsData';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import ArticleModal from './ArticleModal';
import AuthorProfile from './AuthorProfile';
import { useNews } from '../hooks/useNews';
import { useState } from 'react';


const MoreToExplore = () => {
  const { data, loading, error, refetch } = useMoreToExploreData();
  const [selectedArticle, setSelectedArticle] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };





  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [showAuthorProfile, setShowAuthorProfile] = useState(false)
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
      <section className="bg-white text-black py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center h-32 md:h-64">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin text-blue-600" />
              <span className="text-base md:text-lg">Loading more stories...</span>
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
              <h3 className="text-base md:text-lg font-semibold mb-2">Failed to load stories</h3>
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
    <section className="bg-gray-50 text-black py-8 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-black tracking-wide">LATEST NEWS</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-red-600 to-transparent"></div>
          </div>
          {error && (
            <div className="mt-2 text-xs md:text-sm text-amber-600 flex items-center gap-2">
              <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
              Using cached data due to API error
            </div>
          )}
        </div>

        {/* Main Featured Story Section */}
        <div className="mb-6 md:mb-8">
          {/* Mobile Layout - Stack vertically */}
          <div className="block lg:hidden space-y-4">
            {/* Central Large Image - Mobile */}
            <div 
              className="relative hover-lift cursor-pointer"
              onClick={() => handleArticleClick(data.mainStory.left)}
            >
              <div className="relative h-48 sm:h-56 md:h-64 bg-cover bg-center rounded-xl overflow-hidden shadow-lg"
                   style={{backgroundImage: `url('${data.mainStory.center.imageUrl}')`}}>
                <div className="absolute inset-0 gradient-overlay"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="bg-red-600 px-2 py-1 rounded-full text-xs font-semibold mb-2">FEATURED</div>
                </div>
              </div>
            </div>

            {/* Left and Right Stories - Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                className="news-card-hover bg-white p-4 md:p-6 rounded-xl shadow-lg cursor-pointer"
                onClick={() => handleArticleClick(data.mainStory.left)}
              >
                <h3 className="text-lg md:text-xl font-bold leading-tight mb-3 text-black hover:text-red-600 transition-colors cursor-pointer">
                  {data.mainStory.left.title}
                </h3>
                {data.mainStory.left.summary && (
                  <p className="text-gray-600 text-sm mb-4">
                    {data.mainStory.left.summary}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                  <span>{data.mainStory.left.timeAgo}</span>
                  <span>•</span>
                  <span className="text-blue-600 font-semibold">{data.mainStory.left.category}</span>
                </div>
              </div>

              <div 
                className="news-card-hover bg-white p-4 md:p-6 rounded-xl shadow-lg cursor-pointer"
                onClick={() => handleArticleClick(data.mainStory.right)}
              >
                <h3 className="text-lg md:text-xl font-bold leading-tight mb-3 text-black hover:text-red-600 transition-colors cursor-pointer">
                  {data.mainStory.right.title}
                </h3>
                {data.mainStory.right.summary && (
                  <p className="text-gray-600 text-sm mb-4">
                    {data.mainStory.right.summary}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                  <span>{data.mainStory.right.timeAgo}</span>
                  <span>•</span>
                  <span className="text-blue-600 font-semibold">{data.mainStory.right.category}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Original 3-column layout */}
          <div className="hidden lg:grid grid-cols-12 gap-8">
            {/* Left Text Story */}
            <div 
              className="col-span-3 news-card-hover bg-white p-6 rounded-xl shadow-lg cursor-pointer"
              onClick={() => handleArticleClick(data.mainStory.left)}
            >
              <h3 className="text-xl font-bold leading-tight mb-3 text-black hover:text-red-600 transition-colors cursor-pointer">
                {data.mainStory.left.title}
              </h3>
              {data.mainStory.left.summary && (
                <p className="text-gray-600 text-sm mb-4">
                  {data.mainStory.left.summary}
                </p>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{data.mainStory.left.timeAgo}</span>
                <span>•</span>
                <span className="text-blue-600 font-semibold">{data.mainStory.left.category}</span>
              </div>
            </div>

            {/* Central Large Image */}
            <div 
              className="col-span-6 relative hover-lift cursor-pointer"
              onClick={() => handleArticleClick(data.mainStory.left)}
            >
              <div className="relative h-80 bg-cover bg-center rounded-xl overflow-hidden shadow-lg"
                   style={{backgroundImage: `url('${data.mainStory.center.imageUrl}')`}}>
                <div className="absolute inset-0 gradient-overlay"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="bg-red-600 px-3 py-1 rounded-full text-sm font-semibold mb-2">FEATURED</div>
                </div>
              </div>
            </div>

            {/* Right Text Story */}
            <div 
              className="col-span-3 news-card-hover bg-white p-6 rounded-xl shadow-lg cursor-pointer"
              onClick={() => handleArticleClick(data.mainStory.right)}
            >
              <h3 className="text-xl font-bold leading-tight mb-3 text-black hover:text-red-600 transition-colors cursor-pointer">
                {data.mainStory.right.title}
              </h3>
              {data.mainStory.right.summary && (
                <p className="text-gray-600 text-sm mb-4">
                  {data.mainStory.right.summary}
                </p>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{data.mainStory.right.timeAgo}</span>
                <span>•</span>
                <span className="text-blue-600 font-semibold">{data.mainStory.right.category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {data.bottomStories.map((story, index) => (
            <div 
              key={story.id || index} 
              className="relative news-card-hover bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
              onClick={() => handleArticleClick(story)}
            >
              <div className="relative h-40 sm:h-44 md:h-48 bg-cover bg-center overflow-hidden"
                   style={{backgroundImage: `url('${story.imageUrl}')`}}>
                <div className="absolute inset-0 gradient-overlay"></div>
                <div className="absolute top-2 right-2 md:top-3 md:right-3">
                  <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs font-semibold">
                    {story.category}
                  </span>
                </div>
              </div>
              <div className="p-3 md:p-4">
                <h4 className="text-sm md:text-base font-bold leading-tight mb-2 text-black hover:text-red-600 transition-colors">
                  {story.title}
                </h4>
                {story.summary && (
                  <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2">
                    {story.summary}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                  <span>{story.timeAgo}</span>
                  <span>•</span>
                  <span className="text-blue-600 font-semibold">{story.category}</span>
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

export default MoreToExplore;