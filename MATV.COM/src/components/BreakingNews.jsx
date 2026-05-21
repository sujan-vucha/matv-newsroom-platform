import React from 'react';
import { AlertTriangle } from 'lucide-react';
import ArticleModal from './ArticleModal';
import { useBreakingNews } from '../store';

const BreakingNews = () => {
  const [selectedArticle, setSelectedArticle] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [breakingNews, setBreakingNews] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  
  const { fetchBreakingNews } = useBreakingNews();

  React.useEffect(() => {
    async function loadBreakingNews() {
      setLoading(true);
      const result = await fetchBreakingNews();
      setBreakingNews(result.data || []);
      setLoading(false);
    }
    
    loadBreakingNews();
  }, []);


  const handleNewsClick = (newsItem) => {
    setSelectedArticle(newsItem);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 overflow-hidden shadow-lg">
        <div className="flex items-center">
          <div className="flex items-center gap-2 px-6 py-2 bg-red-800 font-bold text-sm shadow-lg">
            <AlertTriangle className="w-4 h-4" />
            <span className="tracking-wide">BREAKING NEWS</span>
          </div>
          <div className="flex-1 relative">
            <div className="animate-marquee whitespace-nowrap py-2">
              {breakingNews.map((news, index) => (
                <span 
                  key={index} 
                  className="inline-block mx-12 text-sm font-medium hover:text-yellow-200 transition-colors cursor-pointer"
                  onClick={() => handleNewsClick(news)}
                >
                  {news.displayText}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <ArticleModal 
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default BreakingNews;