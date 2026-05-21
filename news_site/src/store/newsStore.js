import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { newsApi } from '../api/newsApi';

const initialState = {
  articles: [],
  featuredArticle: null,
  trendingTopics: [],
  loading: false,
  error: null,
};

export const useNewsStore = create(
  devtools(
    (set, get) => ({
      ...initialState,

      // Actions
      fetchArticles: async (page = 1, category) => {
        set({ loading: true, error: null });
        
        try {
          const response = await newsApi.getAllArticles({ page, limit: 10, category });
          
          if (response.success && response.data) {
            const { articles } = response.data;
            set({ 
              articles: page === 1 ? articles : [...get().articles, ...articles],
              loading: false 
            });
          } else {
            set({ error: response.error || 'Failed to fetch articles', loading: false });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            loading: false 
          });
        }
      },

      fetchFeaturedArticle: async () => {
        try {
          const response = await newsApi.getFeaturedArticle();
          
          if (response.success && response.data) {
            set({ featuredArticle: response.data });
          }
        } catch (error) {
          console.error('Failed to fetch featured article:', error);
        }
      },

      fetchTrendingTopics: async () => {
        try {
          const response = await newsApi.getTrendingArticles();
          
          if (response.success && response.data) {
            const topics = response.data.map(article => article.category).slice(0, 6);
            set({ trendingTopics: [...new Set(topics)] });
          }
        } catch (error) {
          console.error('Failed to fetch trending topics:', error);
        }
      },

      searchArticles: async (query) => {
        set({ loading: true, error: null });
        
        try {
          const response = await newsApi.searchArticles(query);
          
          if (response.success && response.data) {
            set({ articles: response.data.articles, loading: false });
          } else {
            set({ error: response.error || 'Search failed', loading: false });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Search failed',
            loading: false 
          });
        }
      },

      trackArticleView: async (articleId) => {
        try {
          await newsApi.trackView(articleId);
        } catch (error) {
          console.error('Failed to track article view:', error);
        }
      },

      trackArticleShare: async (articleId, platform) => {
        try {
          await newsApi.trackShare(articleId, platform);
        } catch (error) {
          console.error('Failed to track article share:', error);
        }
      },

      // State setters
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'news-store',
    }
  )
);