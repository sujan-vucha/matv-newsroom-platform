// Money Store - handles data fetching and state management

// Money section mock data
const moneyData = [
  {
    id: 'money-1',
    title: "Indian investments top tally for London's ambitious new 'Growth Plan'",
    summary: "Indian companies lead foreign investment commitments in London's new economic growth strategy, signaling strong bilateral business ties.",
    content: "Indian companies have emerged as the largest contributors to London's ambitious new Growth Plan, with investments totaling over £2.5 billion committed across various sectors. The plan, designed to boost London's post-pandemic economic recovery, has attracted significant interest from Indian multinational corporations, particularly in technology, financial services, and green energy sectors. Major Indian conglomerates including Tata Group, Infosys, and Wipro have announced substantial expansion plans in London, creating thousands of new jobs and strengthening the UK-India economic partnership. The investments span across fintech innovation hubs, sustainable technology centers, and advanced manufacturing facilities.",
    category: "Investments",
    timeAgo: "4 hrs ago",
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    author: "Business Correspondent",
    source: "Money Desk",
    imageUrl: "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800",
    tags: ["investments", "london", "india", "growth plan"]
  },
  {
    id: 'money-2',
    title: "Tata Motors veteran takes over Birmingham's Aston University Indian alumni network",
    summary: "Former Tata Motors executive appointed to lead prestigious university's Indian alumni association, strengthening industry-academia links.",
    content: "A distinguished former executive from Tata Motors has been appointed as the new president of Aston University's Indian Alumni Network, marking a significant milestone in strengthening ties between Indian industry leaders and UK academic institutions. The appointment comes as part of Aston University's broader strategy to enhance its global alumni engagement and foster stronger connections with the Indian business community. The new president brings over two decades of automotive industry experience and has been instrumental in several major international business ventures. Under this leadership, the network plans to launch new mentorship programs, scholarship initiatives, and collaborative research projects that will benefit both current students and alumni.",
    category: "News & Interviews",
    timeAgo: "6 hrs ago",
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    author: "Education Correspondent",
    source: "Money Desk",
    imageUrl: "https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=800",
    tags: ["tata motors", "aston university", "alumni", "leadership"]
  },
  {
    id: 'money-3',
    title: "UK's Maharaja Drinks cheers International Women's Day with Indian success stories",
    summary: "British-Indian beverage company celebrates women entrepreneurs and their contributions to the UK's diverse business landscape.",
    content: "Maharaja Drinks, a prominent UK-based beverage company with Indian heritage, marked International Women's Day by highlighting the remarkable success stories of Indian women entrepreneurs who have made significant contributions to the British business ecosystem. The celebration featured a series of interviews and profiles showcasing women who have built successful enterprises across various sectors, from technology startups to traditional manufacturing businesses. The company's initiative aims to inspire the next generation of female entrepreneurs while recognizing the vital role that Indian women play in the UK's economic growth. The event also announced a new mentorship program designed to support aspiring women entrepreneurs from diverse backgrounds.",
    category: "News & Interviews",
    timeAgo: "8 hrs ago",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    author: "Business Features Team",
    source: "Money Desk",
    imageUrl: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
    tags: ["women entrepreneurs", "maharaja drinks", "international women's day", "success stories"]
  },
  {
    id: 'money-4',
    title: "Indian fintech startups secure record £500M in UK venture capital funding",
    summary: "British investors show unprecedented confidence in Indian financial technology companies expanding into European markets.",
    content: "Indian fintech startups have achieved a historic milestone by securing over £500 million in venture capital funding from UK-based investors in the past quarter, representing the highest amount ever recorded for cross-border fintech investments between the two nations. The funding round included several prominent Indian companies specializing in digital payments, blockchain technology, and artificial intelligence-driven financial services. British venture capital firms have shown particular interest in Indian companies that demonstrate strong potential for European market expansion. The investments are expected to create significant employment opportunities in both countries while fostering innovation in the rapidly evolving financial technology sector.",
    category: "Fintech",
    timeAgo: "1 day ago",
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    author: "Fintech Correspondent",
    source: "Money Desk",
    imageUrl: "https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=800",
    tags: ["fintech", "venture capital", "startups", "funding"]
  },
  {
    id: 'money-5',
    title: "Cryptocurrency adoption surges among UK's Indian diaspora community",
    summary: "Digital currency usage grows significantly within British-Indian communities, driven by remittances and investment opportunities.",
    content: "The adoption of cryptocurrency among the UK's Indian diaspora community has experienced remarkable growth, with usage increasing by over 300% in the past year according to recent financial technology surveys. The surge is primarily driven by the community's need for efficient cross-border remittances to India and growing interest in digital investment opportunities. Several UK-based cryptocurrency exchanges have reported that British-Indians now represent one of their largest user demographics, particularly for Bitcoin, Ethereum, and India-focused digital assets. Financial experts attribute this trend to the community's tech-savvy nature, strong family ties requiring regular money transfers, and increasing awareness of cryptocurrency as an alternative investment vehicle.",
    category: "Cryptocurrency",
    timeAgo: "2 days ago",
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Crypto Analyst",
    source: "Money Desk",
    imageUrl: "https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=800",
    tags: ["cryptocurrency", "diaspora", "remittances", "digital assets"]
  },
  {
    id: 'money-6',
    title: "Green bonds market sees major Indian corporate participation in London",
    summary: "Indian companies increasingly turning to London's green finance market to fund sustainable development projects.",
    content: "London's green bonds market has witnessed a significant influx of Indian corporate participation, with several major Indian companies choosing the UK capital as their preferred destination for sustainable finance initiatives. The trend reflects growing corporate commitment to environmental sustainability and the attractiveness of London's mature green finance ecosystem. Indian companies across sectors including renewable energy, sustainable manufacturing, and clean technology have successfully raised over £1.2 billion through green bond issuances in London this year. The London Stock Exchange has actively courted Indian issuers by providing specialized support services and streamlined listing processes for green financial instruments, positioning itself as a gateway for Indian companies seeking to access European sustainable finance markets.",
    category: "Green Finance",
    timeAgo: "3 days ago",
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Sustainable Finance Team",
    source: "Money Desk",
    imageUrl: "https://images.pexels.com/photos/8828687/pexels-photo-8828687.jpeg?auto=compress&cs=tinysrgb&w=800",
    tags: ["green bonds", "sustainable finance", "london stock exchange", "environmental"]
  }
];

class MoneyStore {
  constructor() {
    this.data = null;
    this.loading = false;
    this.error = null;
    this.useAPI = true; // Toggle between mock data and API
  }

  // Fetch money data
  async fetchMoneyData() {
    this.loading = true;
    this.error = null;

    try {
     if (this.useAPI) {
  const API = import.meta.env.VITE_BACKEND_API_BASE_URL;
  if (!API) {
    throw new Error('Backend URL not configured');
  }

  const response = await fetch(`${API}/home-contents/published/pages/money`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const json = await response.json();
  const storiesArray = Array.isArray(json.data) ? json.data : [];

  this.data = storiesArray;
}

    } catch (error) {
      this.error = error.message;
      // Fallback to mock data on API error
      this.data = moneyData;
    } finally {
      this.loading = false;
    }

    return {
      data: this.data,
      loading: this.loading,
      error: this.error
    };
  }

  // Get stories by category
  getStoriesByCategory(category) {
    if (!this.data) return [];
    return this.data.filter(story => 
      story.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Get featured stories (first 3)
  getFeaturedStories() {
    if (!this.data) return [];
    return this.data.slice(0, 3);
  }

  // Get specific money story by ID
  getMoneyStoryById(id) {
    if (!this.data) return null;
    return this.data.find(story => story.id === id);
  }

  // Search stories by tags
  searchByTags(tag) {
    if (!this.data) return [];
    return this.data.filter(story => 
      story.tags && story.tags.some(t => 
        t.toLowerCase().includes(tag.toLowerCase())
      )
    );
  }

  // Simulate network delay for realistic loading states
  async simulateNetworkDelay(ms = 700) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Toggle between API and mock data
  setUseAPI(useAPI) {
    this.useAPI = useAPI;
  }
}

// Export singleton instance
export const moneyStore = new MoneyStore();

// Export hook for React components
export function useMoney() {
  return {
    fetchMoneyData: () => moneyStore.fetchMoneyData(),
    getStoriesByCategory: (category) => moneyStore.getStoriesByCategory(category),
    getFeaturedStories: () => moneyStore.getFeaturedStories(),
    getMoneyStoryById: (id) => moneyStore.getMoneyStoryById(id),
    searchByTags: (tag) => moneyStore.searchByTags(tag),
    setUseAPI: (useAPI) => moneyStore.setUseAPI(useAPI)
  };
}