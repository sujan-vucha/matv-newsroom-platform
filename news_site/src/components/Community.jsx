import React from 'react';
import { Clock, MapPin, Users, Heart, MessageCircle, Share2, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useCommunityData } from '../hooks/useCommunity';
import ArticleModal from './ArticleModal';
import { useState } from 'react';
import AuthorProfile from './AuthorProfile';
import { useNews } from '../hooks/useNews';

const Community = () => {
  const { data, loading, error, refetch } = useCommunityData();
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
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-red-600" />
              <span className="text-lg">Loading community stories...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error && !data) {
    return (
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to load community stories</h3>
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
        </div>
      </section>
    );
  }

  if (!data) return null;

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-black tracking-wide">BUSINESS</h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-red-600 to-transparent"></div>
          </div>
          
          {error && (
            <div className="mb-4 text-sm text-amber-600 flex items-center gap-2 bg-amber-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              Using cached data due to API error
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Featured Story */}
          <div 
            className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            onClick={() => handleArticleClick(data.mainStory)}
          >
            <div className="relative h-80">
              <img
                src={data.mainStory?.imageUrl || '/fallback-image.jpg'}
                alt={data.mainStory?.title || 'Story image'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg">
                  {data.mainStory.category}
                </span>
              </div>

              {/* Featured Badge */}
             {data.mainStory?.category && (
            <div className="absolute top-4 left-4">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg">
                {data.mainStory.category}
              </span>
            </div>
          )}


              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="mb-3">
                  <div className="flex items-center gap-3 text-white/80 text-sm mb-2">


                    {/* <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{data.mainStory.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{data.mainStory.timeAgo}</span>
                    </div> */}


                    
                    {data.mainStory.attendees && (
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{data.mainStory.attendees}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-yellow-300 transition-colors">
                  {data.mainStory.title}
                </h3>
                
                <p className="text-white/90 text-sm mb-4 line-clamp-2">
                  {data.mainStory.summary}
                </p>

                {/* Tags */}
                {data.mainStory.tags && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {data.mainStory.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Engagement */}
                <div className="flex items-center gap-4 text-white/80">
                  <button className="flex items-center gap-1 hover:text-red-300 transition-colors">
                    {/* <Heart className="w-4 h-4" />
                    <span className="text-xs">{Math.floor(Math.random() * 500) + 100}</span> */}
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-300 transition-colors">
                    {/* <MessageCircle className="w-4 h-4" />
                    <span className="text-xs">{Math.floor(Math.random() * 50) + 10}</span> */}
                  </button>
                  <button className="flex items-center gap-1 hover:text-green-300 transition-colors">
                    {/* <Share2 className="w-4 h-4" /> */}
                    {/* <span className="text-xs">Share</span> */}
                  </button>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-white/90 text-red-900 px-4 py-2 rounded-full font-semibold shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                  Read Full Story
                </div>
              </div>
            </div>
          </div>

          {/* Side Stories */}
          <div className="flex flex-col gap-4">
            {data.sideStories.slice(0, 2).map((story, index) => (
              <div 
                key={story.id}
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => handleArticleClick(story)}
              >
                <div className="flex">
                  <div className="relative w-32 h-24 flex-shrink-0">
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Category Badge */}
                    <div className="absolute top-1 left-1">
                      <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                        {story.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 flex-1">
                    <h4 className="font-bold text-gray-900 text-sm leading-tight mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                      {story.title}
                    </h4>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      
                    </div>

                    {/* Tags */}
                    {story.tags && (
                      <div className="flex flex-wrap gap-1">
                        {story.tags.slice(0, 2).map((tag, tagIndex) => (
                          <span key={tagIndex} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Additional Stories in Grid */}
            {data.additionalStories && data.additionalStories.length > 0 && (
              <div className="grid grid-cols-1 gap-3">
                {data.additionalStories.slice(0, 1).map((story, index) => (
                  <div 
                    key={story.id}
                    className="group bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-red-300"
                    onClick={() => handleArticleClick(story)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                        {story.category}
                      </span>
                      <span className="text-xs text-gray-500">{story.timeAgo}</span>
                    </div>
                    
                    <h4 className="font-bold text-gray-900 text-sm mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                      {story.title}
                    </h4>
                    
                    <p className="text-gray-600 text-xs line-clamp-2">
                      {story.summary}
                    </p>

                    {/* Tags */}
                    {story.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {story.tags.slice(0, 2).map((tag, tagIndex) => (
                          <span key={tagIndex} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
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

export default Community;