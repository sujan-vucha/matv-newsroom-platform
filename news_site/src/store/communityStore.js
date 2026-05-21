// Community Store - handles data fetching and state management

// Community section mock data (kept as fallback)
const communityData = {
  mainStory: {
    id: 'community-main-1',
    title: 'Inspiring Indian Women celebrate women power with She Inspires Awards 2025',
    summary: 'A celebration of remarkable achievements and contributions of Indian women across various fields, recognizing their impact on society and inspiring future generations.',
    content:
      "The She Inspires Awards 2025 brought together extraordinary Indian women from diverse backgrounds to celebrate their remarkable contributions to society. The event highlighted achievements in technology, arts, social work, entrepreneurship, and leadership. Award recipients shared their inspiring journeys, challenges overcome, and their vision for empowering the next generation of women leaders. The ceremony featured keynote speeches, panel discussions, and networking opportunities that fostered collaboration and mentorship among attendees. The awards recognized women who have broken barriers, created positive change, and inspired others through their work and dedication.",
    imageUrl:
      'https://images.pexels.com/photos/3810792/pexels-photo-3810792.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'Arts & Culture',
    timeAgo: '3 hrs ago',
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    author: 'Cultural Correspondent',
    source: 'Community Desk',
    location: 'Mumbai',
    attendees: '500+',
    isFeature: true,
    tags: ['women empowerment', 'awards', 'inspiration', 'leadership']
  },
  sideStories: [
    {
      id: 'community-side-1',
      title: 'Dharmic Prayer Room opens at Queen Elizabeth Hospital Birmingham',
      summary:
        'A new interfaith prayer space designed to serve the spiritual needs of patients, families, and staff from diverse religious backgrounds.',
      content:
        "Queen Elizabeth Hospital Birmingham has inaugurated a state-of-the-art Dharmic Prayer Room, providing a dedicated space for Hindu, Sikh, Buddhist, and Jain communities. The facility features traditional architectural elements, meditation areas, and resources for various religious practices. The initiative reflects the hospital's commitment to inclusive healthcare and recognizing the spiritual needs of its diverse patient population. Community leaders praised the facility as a significant step toward cultural sensitivity in healthcare settings. The room includes separate areas for different practices, prayer books in multiple languages, and facilities for ritual cleansing.",
      imageUrl:
        'https://images.pexels.com/photos/2832022/pexels-photo-2832022.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Faith & Devotion',
      timeAgo: '5 hrs ago',
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      author: 'Faith Correspondent',
      source: 'Community Desk',
      location: 'Birmingham',
      tags: ['interfaith', 'healthcare', 'spirituality', 'inclusion']
    },
    {
      id: 'community-side-2',
      title:
        "Reading diaspora pays soulful tribute to the timeless legacy of Carnatic music with 'SAMARPAN 2025'",
      summary:
        'A musical celebration showcasing the rich heritage of Carnatic music through performances by local and international artists.',
      content:
        "The Reading Indian community organized SAMARPAN 2025, a magnificent tribute to Carnatic music featuring renowned artists from India and the UK. The event showcased classical compositions, contemporary interpretations, and collaborative performances that bridged traditional and modern musical expressions. Young musicians had the opportunity to learn from masters, ensuring the preservation and evolution of this ancient art form. The concert series attracted music enthusiasts from across the region and strengthened cultural bonds within the diaspora community. The event featured workshops, masterclasses, and interactive sessions that engaged audiences of all ages.",
      imageUrl:
        'https://images.pexels.com/photos/2833377/pexels-photo-2833377.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Arts & Culture',
      timeAgo: '7 hrs ago',
      publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
      author: 'Arts Correspondent',
      source: 'Community Desk',
      location: 'Reading',
      tags: ['carnatic music', 'cultural heritage', 'diaspora', 'tradition']
    },
    {
      id: 'community-side-3',
      title: 'Local youth group launches environmental awareness campaign in schools',
      summary:
        'Young activists partner with educational institutions to promote sustainability and environmental consciousness among students.',
      content:
        'A dedicated group of young environmental activists has launched an innovative awareness campaign targeting schools across the region. The initiative includes interactive workshops, tree-planting drives, and waste reduction programs designed to educate students about environmental challenges and solutions. The campaign has already reached over 2,000 students and has resulted in significant improvements in recycling rates and energy conservation in participating schools. The youth group plans to expand the program to include community centers and local businesses.',
      imageUrl:
        'https://images.pexels.com/photos/2833377/pexels-photo-2833377.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Environment',
      timeAgo: '1 day ago',
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      author: 'Environmental Correspondent',
      source: 'Community Desk',
      location: 'Manchester',
      tags: ['youth activism', 'environment', 'education', 'sustainability']
    }
  ],
  additionalStories: [
    {
      id: 'community-additional-1',
      title: 'Community kitchen serves 10,000th meal to those in need',
      summary:
        'Local volunteers celebrate milestone achievement in their mission to combat food insecurity in the neighborhood.',
      content:
        'The Helping Hands Community Kitchen reached a significant milestone this week, serving its 10,000th free meal since opening two years ago. The volunteer-run initiative has become a lifeline for families facing food insecurity, providing nutritious meals and a sense of community. The kitchen operates six days a week and has expanded its services to include food parcels for families and cooking classes for young people. Local businesses and residents have rallied around the cause, donating ingredients, time, and resources to support the initiative.',
      imageUrl:
        'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Social Impact',
      timeAgo: '2 days ago',
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      author: 'Social Affairs Correspondent',
      source: 'Community Desk',
      location: 'Leeds',
      tags: ['food security', 'volunteering', 'community support', 'social impact']
    },
    {
      id: 'community-additional-2',
      title: 'Digital literacy program bridges generational gap in technology',
      summary:
        'Intergenerational initiative connects tech-savvy youth with seniors to improve digital skills and combat isolation.',
      content:
        "A groundbreaking digital literacy program has successfully connected over 200 seniors with young volunteers to improve technology skills and reduce social isolation. The program pairs tech-savvy teenagers with older adults for weekly sessions covering smartphone usage, video calling, online banking, and social media safety. Participants report increased confidence in using technology and stronger intergenerational relationships. The initiative has been so successful that it's being replicated in neighboring communities.",
      imageUrl:
        'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Technology',
      timeAgo: '3 days ago',
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      author: 'Technology Correspondent',
      source: 'Community Desk',
      location: 'Bristol',
      tags: ['digital literacy', 'intergenerational', 'technology', 'social inclusion']
    }
  ]
};

// ---------- helpers for API mapping ----------
const joinUrl = (base = '', path = '') =>
  `${String(base).replace(/\/+$/, '')}/${String(path).replace(/^\/+/, '')}`;

const toRelativeTime = (iso) => {
  if (!iso) return '';
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hrs ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

const mapNewsItem = (item) => {
  // Safely map the API shape to your UI shape
  const id = item?.id?.toString?.() ?? cryptoRandomId();
  const title = item?.title ?? '';
  const summary = item?.image_caption || item?.summary || '';
  const content = item?.content || '';
  const imageUrl =
    item?.image_banner || item?.medium_thumbnail || item?.image || '';
  const category = item?.category_name || '';
  const publishedAt = item?.published_at || item?.created_at || null;
  const author = item?.author || '';
  const tags = Array.isArray(item?.tags)
    ? item.tags
    : (typeof item?.tags === 'string' ? item.tags.split(',').map(t => t.trim()).filter(Boolean) : []);

  return {
    id,
    title,
    summary,
    content,
    imageUrl,
    category,
    timeAgo: toRelativeTime(publishedAt),
    publishedAt,
    author,
    source: 'News API',
    location: item?.location || '',
    isFeature: Boolean(item?.top_news === 'True' || item?.featured_news === 'True'),
    tags
  };
};

// Fallback ID generator if API lacks id
const cryptoRandomId = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);

// ---------- Store ----------
class CommunityStore {
  constructor() {
    this.data = null;
    this.loading = false;
    this.error = null;
    this.useAPI = true; // Toggle between mock data and API
  }

  // Fetch community data (Business category only)
  async fetchCommunityData() {
    this.loading = true;
    this.error = null;

    try {
      if (this.useAPI) {
        // Read envs requested by you
        const BASE = import.meta.env.VITE_NEWS_API_BASE_URL;
        const PATH = import.meta.env.VITE_NEWS_API_PATH;
        if (!BASE || !PATH) {
          throw new Error(
            'News API env vars missing. Please set VITE_NEWS_API_BASE_URL and VITE_NEWS_API_PATH.'
          );
        }

        const url = joinUrl(BASE, PATH); // e.g., https://api... + /news
        const res = await fetch(url, { method: 'GET' });

        if (!res.ok) {
          throw new Error(`API request failed: ${res.status}`);
        }

        const json = await res.json();
        const items = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];

        // Filter to Business category only
        const businessOnly = items.filter(
          (it) => (it?.category_name || '').toLowerCase() === 'business'
        );

        // Map to UI structure
        const mapped = businessOnly.map(mapNewsItem);

        // Build your 3-bucket layout
        this.data = {
          mainStory: mapped[0] || null,
          sideStories: mapped.slice(1, 3),
          additionalStories: mapped.slice(3)
        };

        // If nothing came back, fall back to mock
        if (!this.data.mainStory && this.data.sideStories.length === 0) {
          this.data = communityData;
        }
      } else {
        await this.simulateNetworkDelay();
        this.data = communityData;
      }
    } catch (err) {
      this.error = err?.message || 'Unknown error';
      // Fallback to mock data on API error
      this.data = communityData;
    } finally {
      this.loading = false;
    }

    return {
      data: this.data,
      loading: this.loading,
      error: this.error
    };
  }

  // Get all stories from community section
  getAllStories() {
    if (!this.data) return [];
    const stories = [];
    if (this.data.mainStory) stories.push(this.data.mainStory);
    stories.push(...(this.data.sideStories || []));
    stories.push(...(this.data.additionalStories || []));
    return stories;
  }

  // Get stories by category (works for both mock and API)
  getStoriesByCategory(category) {
    const allStories = this.getAllStories();
    return allStories.filter(
      (story) =>
        (story.category || '').toLowerCase() === (category || '').toLowerCase()
    );
  }

  // Get featured stories
  getFeaturedStories() {
    const allStories = this.getAllStories();
    return allStories.filter((story) => story.isFeature);
  }

  // Get stories by location
  getStoriesByLocation(location) {
    const allStories = this.getAllStories();
    return allStories.filter(
      (story) =>
        story.location &&
        story.location.toLowerCase().includes((location || '').toLowerCase())
    );
  }

  // Search stories by tags
  searchByTags(tag) {
    const allStories = this.getAllStories();
    return allStories.filter(
      (story) =>
        story.tags &&
        story.tags.some((t) => t.toLowerCase().includes((tag || '').toLowerCase()))
    );
  }

  // Get specific community story by ID
  getCommunityStoryById(id) {
    if (!this.data) return null;
    const allStories = this.getAllStories();
    return allStories.find((story) => story.id === id) || null;
  }

  // Simulate network delay for realistic loading states
  async simulateNetworkDelay(ms = 900) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Toggle between API and mock data
  setUseAPI(useAPI) {
    this.useAPI = useAPI;
  }
}

// Export singleton instance
export const communityStore = new CommunityStore();

// Export hook for React components
export function useCommunity() {
  return {
    fetchCommunityData: () => communityStore.fetchCommunityData(),
    getAllStories: () => communityStore.getAllStories(),
    getStoriesByCategory: (category) => communityStore.getStoriesByCategory(category),
    getFeaturedStories: () => communityStore.getFeaturedStories(),
    getStoriesByLocation: (location) => communityStore.getStoriesByLocation(location),
    searchByTags: (tag) => communityStore.searchByTags(tag),
    getCommunityStoryById: (id) => communityStore.getCommunityStoryById(id),
    setUseAPI: (useAPI) => communityStore.setUseAPI(useAPI)
  };
}
