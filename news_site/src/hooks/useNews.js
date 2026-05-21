import { useEffect } from 'react';
import { useNewsStore } from '../store/newsStore';

export const useNews = () => {
  const {
    articles,
    featuredArticle,
    trendingTopics,
    loading,
    error,
    fetchArticles,
    fetchFeaturedArticle,
    fetchTrendingTopics,
    searchArticles,
    trackArticleView,
    trackArticleShare,
    clearError,
  } = useNewsStore();

  // Initialize data on mount
  useEffect(() => {
    if (articles.length === 0 && !loading) {
      fetchArticles();
    }
    if (!featuredArticle && !loading) {
      fetchFeaturedArticle();
    }
    if (trendingTopics.length === 0 && !loading) {
      fetchTrendingTopics();
    }
  }, [articles.length, featuredArticle, trendingTopics.length, loading]);

  return {
    // State
    articles,
    featuredArticle,
    trendingTopics,
    loading,
    error,
    
    // Actions
    fetchArticles,
    fetchFeaturedArticle,
    fetchTrendingTopics,
    searchArticles,
    trackArticleView,
    trackArticleShare,
    clearError,
  };
};