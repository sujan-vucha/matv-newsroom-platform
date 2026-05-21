import { API_ENDPOINTS, getApiUrl, MOCK_DATA_ENABLED } from './config';

// Mock author data
const mockAuthors = [
  {
    _id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@newshub.com',
    bio: 'Sarah Johnson is a senior technology reporter with over 8 years of experience covering artificial intelligence, machine learning, and emerging technologies. She holds a Master\'s degree in Computer Science from MIT and has previously worked at TechCrunch and Wired. Sarah specializes in making complex technical topics accessible to general audiences.',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    title: 'Senior Technology Reporter',
    category: 'Technology',
    socialLinks: {
      twitter: 'https://twitter.com/sarahjtech',
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      website: 'https://sarahjohnson.tech'
    },
    articlesCount: 156,
    followersCount: 12400,
    joinedDate: '2020-03-15',
    location: 'San Francisco, CA',
    expertise: ['AI', 'Machine Learning', 'Startups', 'Cybersecurity'],
    articles: [
      {
        _id: '1',
        title: 'AI Revolution: How Machine Learning is Transforming Industries',
        subtitle: 'From healthcare to finance, artificial intelligence is reshaping the way we work and live',
        content: '<p>Artificial intelligence and machine learning are no longer futuristic concepts—they are transforming industries today. From predictive analytics in healthcare to algorithmic trading in finance, AI is revolutionizing how businesses operate and make decisions.</p><p>The healthcare sector has seen remarkable advances with AI-powered diagnostic tools that can detect diseases earlier and more accurately than traditional methods. Meanwhile, the financial industry leverages machine learning algorithms to identify fraud patterns and optimize investment strategies.</p>',
        author: 'Sarah Johnson',
        category: 'Technology',
        publishedAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['AI', 'Machine Learning', 'Technology', 'Innovation'],
        viewCount: 15420,
        commentCount: 89,
        isBreaking: false,
        isTrending: true,
        readTime: 8
      },
      {
        _id: '2',
        title: 'Cybersecurity in the Age of Remote Work',
        subtitle: 'New challenges and solutions for protecting digital assets in distributed workforces',
        content: '<p>The shift to remote work has fundamentally changed the cybersecurity landscape. Organizations now face unprecedented challenges in securing distributed workforces and protecting sensitive data across multiple locations and devices.</p><p>Traditional perimeter-based security models are no longer sufficient. Companies are adopting zero-trust architectures and implementing advanced endpoint protection to safeguard their digital assets in this new era of work.</p>',
        author: 'Sarah Johnson',
        category: 'Technology',
        publishedAt: '2024-01-12T14:15:00Z',
        updatedAt: '2024-01-12T14:15:00Z',
        imageUrl: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['Cybersecurity', 'Remote Work', 'Technology'],
        viewCount: 8930,
        commentCount: 45,
        isBreaking: false,
        isTrending: false,
        readTime: 6
      }
    ]
  },
  {
    _id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@newshub.com',
    bio: 'Michael Chen is an environmental journalist focused on climate change, sustainability, and environmental policy. He has reported from climate summits around the world and has won several awards for his investigative work on corporate environmental practices.',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    title: 'Environmental Correspondent',
    category: 'Environment',
    socialLinks: {
      twitter: 'https://twitter.com/michaelchenenv',
      linkedin: 'https://linkedin.com/in/michaelchen'
    },
    articlesCount: 89,
    followersCount: 8900,
    joinedDate: '2019-08-22',
    location: 'Seattle, WA',
    expertise: ['Climate Change', 'Environmental Policy', 'Sustainability'],
    articles: [
      {
        _id: '3',
        title: 'Climate Summit Reaches Historic Agreement',
        subtitle: 'World leaders commit to ambitious carbon reduction targets',
        content: '<p>In a landmark decision, world leaders at the latest climate summit have reached a historic agreement on carbon reduction targets. The comprehensive plan outlines specific measures each nation will take to combat climate change over the next decade.</p><p>The agreement includes provisions for renewable energy investment, carbon pricing mechanisms, and support for developing nations in their transition to clean energy. Environmental experts are calling it the most significant climate accord since the Paris Agreement.</p>',
        author: 'Michael Chen',
        category: 'Environment',
        publishedAt: '2024-01-14T09:00:00Z',
        updatedAt: '2024-01-14T09:00:00Z',
        imageUrl: 'https://images.pexels.com/photos/9324336/pexels-photo-9324336.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['Climate Change', 'Environment', 'Policy'],
        viewCount: 12750,
        commentCount: 156,
        isBreaking: true,
        isTrending: true,
        readTime: 7
      }
    ]
  }
];

class AuthorApi {
  async request(endpoint, options) {
    // Use mock data if backend is not available
    if (MOCK_DATA_ENABLED) {
      return this.getMockResponse(endpoint);
    }

    try {
      const url = getApiUrl(endpoint);

      
      const response = await fetch(url, {
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

      
      // Ensure socialLinks, title and category are always defined
      if (!Array.isArray(data)) {
        if (data.socialLinks === undefined) {
          data.socialLinks = { twitter: '', linkedin: '' };
        }
        if (data.title === undefined) {
          data.title = 'MATV Staff';
        }
        if (data.category === undefined) {
          data.category = 'BUSINESS';
        }
      }
      
      return {
        success: true,
        data: data.authors || data,
        error: null
      };
    } catch (error) {
      console.error('API request failed:', error);
      // Fallback to mock data for development
      if (MOCK_DATA_ENABLED) {
        console.log('Falling back to mock data...');
        return this.getMockResponse(endpoint);
      }
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to fetch data'
      };
    }
  }

  getMockResponse(endpoint) {

    if (endpoint.includes('/authors/name/')) {
      const authorName = decodeURIComponent(endpoint.split('/authors/name/')[1]);
      const author = mockAuthors.find(a => a.name === authorName);
      return {
        success: true,
        data: author,
        error: author ? null : 'Author not found',
      };
    } else if (endpoint.includes('/authors/')) {
      return {
        success: true,
        data: mockAuthors[0],
        error: null,
      };
    } else {
      return {
        success: true,
        data: mockAuthors,
        error: null,
      };
    }
  }

  // Get all authors
  async getAllAuthors() {
    return this.request(API_ENDPOINTS.AUTHORS.GET_ALL);
  }

  // Get author by ID
  async getAuthorById(id) {
    return this.request(API_ENDPOINTS.AUTHORS.GET_BY_ID(id));
  }

  // Get author by name
  async getAuthorByName(name) {
    return this.request(API_ENDPOINTS.AUTHORS.GET_BY_NAME(name));
  }

  // Get author's articles
  async getAuthorArticles(authorId, params = { page: 1, limit: 10 }) {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
    });

    return this.request(`${API_ENDPOINTS.AUTHORS.GET_ARTICLES(authorId)}?${queryParams}`);
  }

  // Follow author
  async followAuthor(authorId) {
    return this.request(API_ENDPOINTS.AUTHORS.FOLLOW(authorId), {
      method: 'POST',
    });
  }

  // Unfollow author
  async unfollowAuthor(authorId) {
    return this.request(API_ENDPOINTS.AUTHORS.UNFOLLOW(authorId), {
      method: 'DELETE',
    });
  }
}

export const authorApi = new AuthorApi();