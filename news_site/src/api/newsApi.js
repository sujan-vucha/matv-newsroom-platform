import { API_ENDPOINTS, getApiUrl, MOCK_DATA_ENABLED } from './config';

// Mock data for development
const mockArticles = [
  {
    _id: '1',
    title: 'Breaking: Major Tech Company Announces Revolutionary AI Breakthrough',
    summary: 'A leading technology company has unveiled a groundbreaking artificial intelligence system that promises to transform multiple industries.',
    content: '<p>In a landmark announcement today, the company revealed their latest AI system that demonstrates unprecedented capabilities in natural language processing and reasoning. The breakthrough represents years of research and development, with potential applications spanning healthcare, education, and scientific research.</p><p>Industry experts are calling this development a significant milestone in the evolution of artificial intelligence, with implications that could reshape how we interact with technology in our daily lives.</p>',
    author: 'Sarah Johnson',
    category: 'Technology',
    tags: ['AI', 'Technology', 'Innovation'],
    img: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeAgo: '2 hours ago',
    isLive: true,
    views: 15420,
    comments: 89
  },
  {
    _id: '2',
    title: 'Global Climate Summit Reaches Historic Agreement on Carbon Emissions',
    summary: 'World leaders unite on ambitious new targets to combat climate change and reduce global carbon footprint.',
    content: '<p>After days of intense negotiations, representatives from over 190 countries have reached a consensus on new carbon emission reduction targets. The agreement sets forth ambitious goals for the next decade, with binding commitments from major industrial nations.</p><p>Environmental groups have praised the accord as a crucial step forward, while economists analyze the potential impact on global markets and energy sectors.</p>',
    author: 'Michael Chen',
    category: 'Environment',
    tags: ['Climate', 'Environment', 'Politics'],
    img: 'https://images.pexels.com/photos/9324336/pexels-photo-9324336.jpeg?auto=compress&cs=tinysrgb&w=800',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    timeAgo: '1 hour ago',
    isLive: false,
    views: 8930,
    comments: 156
  },
  {
    _id: '3',
    title: 'Stock Markets Rally as Economic Indicators Show Strong Growth',
    summary: 'Major indices reach new highs following positive employment and GDP data releases.',
    content: '<p>Financial markets experienced significant gains today as newly released economic data exceeded analyst expectations. The unemployment rate dropped to its lowest level in years, while GDP growth figures indicate robust economic expansion.</p><p>Investors responded positively to the news, with technology and healthcare sectors leading the rally. Market analysts suggest this trend could continue if upcoming earnings reports meet expectations.</p>',
    author: 'David Rodriguez',
    category: 'Business',
    tags: ['Finance', 'Economy', 'Markets'],
    img: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    timeAgo: '2 hours ago',
    isLive: false,
    views: 12340,
    comments: 67
  },
  {
    _id: '4',
    title: 'Medical Breakthrough: New Treatment Shows Promise for Rare Disease',
    summary: 'Clinical trials demonstrate significant improvement in patients with previously untreatable condition.',
    content: '<p>Researchers at a leading medical institution have announced promising results from Phase III clinical trials of a novel treatment for a rare genetic disorder. The therapy showed remarkable efficacy in treating patients who had exhausted all other treatment options.</p><p>The breakthrough offers hope to thousands of patients worldwide and represents a significant advancement in personalized medicine approaches.</p>',
    author: 'Dr. Emily Watson',
    category: 'Health',
    tags: ['Medicine', 'Research', 'Healthcare'],
    img: 'https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=800',
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    updatedAt: new Date(Date.now() - 10800000).toISOString(),
    timeAgo: '3 hours ago',
    isLive: false,
    views: 6780,
    comments: 34
  },
  {
    _id: '5',
    title: 'Space Mission Successfully Lands on Mars, Begins Scientific Operations',
    summary: 'International space mission achieves historic landing and begins collecting samples from Martian surface.',
    content: '<p>A joint international space mission has successfully landed on Mars and begun its scientific operations. The robotic lander touched down in a region believed to contain evidence of ancient water activity.</p><p>The mission represents years of international collaboration and cutting-edge engineering. Scientists expect the data collected to provide new insights into the possibility of past life on Mars.</p>',
    author: 'James Thompson',
    category: 'Science',
    tags: ['Space', 'Mars', 'Science'],
    img: 'https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg?auto=compress&cs=tinysrgb&w=800',
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    updatedAt: new Date(Date.now() - 14400000).toISOString(),
    timeAgo: '4 hours ago',
    isLive: false,
    views: 9870,
    comments: 123
  },
  {
    _id: '6',
    title: 'Championship Finals Set as Underdog Team Advances',
    summary: 'Surprising playoff victory sets up exciting championship matchup between veteran and rookie teams.',
    content: '<p>In a stunning upset, the underdog team defeated the heavily favored champions to advance to the finals. The victory came after a dramatic overtime period that had fans on the edge of their seats.</p><p>The championship game promises to be an exciting matchup between experience and youth, with both teams bringing unique strengths to the final showdown.</p>',
    author: 'Alex Martinez',
    category: 'Sports',
    tags: ['Sports', 'Championship', 'Finals'],
    img: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800',
    publishedAt: new Date(Date.now() - 18000000).toISOString(),
    updatedAt: new Date(Date.now() - 18000000).toISOString(),
    timeAgo: '5 hours ago',
    isLive: false,
    views: 11250,
    comments: 89
  }
];

class NewsApi {
  async request(endpoint, options) {
    // Use mock data if backend is not available
    if (MOCK_DATA_ENABLED) {
      return this.getMockResponse(endpoint);
    }

    try {
      const response = await fetch(getApiUrl(endpoint), {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      // Fallback to mock data if API fails
      console.log('Falling back to mock data...');
      return this.getMockResponse(endpoint);
    }
  }

  getMockResponse(endpoint) {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        if (endpoint.includes('/news/trending')) {
          resolve({
            success: true,
            data: mockArticles.slice(0, 3),
            error: null,
          });
        } else if (endpoint.includes('/news/featured')) {
          resolve({
            success: true,
            data: mockArticles[0],
            error: null,
          });
        } else if (endpoint.includes('/news')) {
          resolve({
            success: true,
            data: {
              articles: mockArticles,
              total: mockArticles.length,
              hasMore: false,
            },
            error: null,
          });
        } else {
          resolve({
            success: false,
            data: null,
            error: 'Endpoint not found',
          });
        }
      }, 100);
    });
  }

  // Get all articles with pagination
  async getAllArticles(params = { page: 1, limit: 10 }) {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
      ...(params.category && { category: params.category }),
      ...(params.search && { search: params.search }),
    });

    return this.request(`${API_ENDPOINTS.NEWS.GET_ALL}?${queryParams}`);
  }

  // Get article by ID
  async getArticleById(id) {
    return this.request(API_ENDPOINTS.NEWS.GET_BY_ID(id));
  }

  // Get articles by category
  async getArticlesByCategory(category, params = { page: 1, limit: 10 }) {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
    });

    return this.request(`${API_ENDPOINTS.NEWS.GET_BY_CATEGORY(category)}?${queryParams}`);
  }

  // Get trending articles
  async getTrendingArticles() {
    return this.request(API_ENDPOINTS.NEWS.GET_TRENDING);
  }

  // Get featured article
  async getFeaturedArticle() {
    return this.request(API_ENDPOINTS.NEWS.GET_FEATURED);
  }

  // Search articles
  async searchArticles(query, filters) {
    const queryParams = new URLSearchParams({ q: query });
    
    if (filters?.category) queryParams.append('category', filters.category);
    if (filters?.author) queryParams.append('author', filters.author);
    if (filters?.tags) queryParams.append('tags', filters.tags.join(','));
    if (filters?.dateRange) {
      queryParams.append('startDate', filters.dateRange.start);
      queryParams.append('endDate', filters.dateRange.end);
    }

    return this.request(`${API_ENDPOINTS.NEWS.SEARCH}?${queryParams}`);
  }

  // Track article view
  async trackView(articleId) {
    return this.request(API_ENDPOINTS.ANALYTICS.TRACK_VIEW, {
      method: 'POST',
      body: JSON.stringify({ articleId, timestamp: new Date().toISOString() }),
    });
  }

  // Track article share
  async trackShare(articleId, platform) {
    return this.request(API_ENDPOINTS.ANALYTICS.TRACK_SHARE, {
      method: 'POST',
      body: JSON.stringify({ articleId, platform, timestamp: new Date().toISOString() }),
    });
  }
}

export const newsApi = new NewsApi();