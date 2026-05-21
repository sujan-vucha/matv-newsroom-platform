// Breaking News Store - handles data fetching and state management

// Breaking News mock data
const breakingNewsData = [
  {
    id: 'breaking-1',
    title: "Major diplomatic breakthrough announced in Middle East peace talks",
    summary: "International mediators report significant progress in ongoing negotiations between regional powers.",
    content: "In a historic development, international mediators have announced a major breakthrough in Middle East peace talks that have been ongoing for several months. The negotiations, which involve key regional powers and international stakeholders, have reached a critical juncture with both sides expressing cautious optimism about the path forward. Sources close to the talks indicate that significant concessions have been made on both sides, particularly regarding territorial disputes and security arrangements. The breakthrough comes after weeks of intensive diplomatic efforts led by a coalition of international mediators, including representatives from the United Nations, European Union, and several Arab League nations.",
    imageUrl: "https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "World",
    timeAgo: "Just now",
    publishedAt: new Date().toISOString(),
    author: "International Desk",
    source: "GlobalNews",
    isLive: true,
    displayText: "🔴 BREAKING: Major diplomatic breakthrough announced in Middle East peace talks"
  },
  {
    id: 'breaking-2',
    title: "Stock markets surge 3.2% following Fed announcement on interest rates",
    summary: "Federal Reserve's latest decision sends markets soaring as investors react positively to monetary policy changes.",
    content: "Global stock markets experienced a dramatic surge today, with major indices climbing over 3.2% following the Federal Reserve's unexpected announcement regarding interest rate policy. The central bank's decision to maintain current rates while signaling a more dovish stance for the remainder of the year has been met with overwhelming enthusiasm from investors. Trading volumes reached record highs as institutional and retail investors alike rushed to capitalize on the positive sentiment. The technology sector led the gains, with several major tech companies seeing their stock prices rise by more than 5% in early trading.",
    imageUrl: "https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Business",
    timeAgo: "15 min ago",
    publishedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    author: "Financial Markets Team",
    source: "GlobalNews",
    displayText: "⚡ URGENT: Stock markets surge 3.2% following Fed announcement on interest rates"
  },
  {
    id: 'breaking-3',
    title: "International search continues for missing aircraft in Pacific Ocean",
    summary: "Rescue teams from multiple countries coordinate efforts in challenging weather conditions.",
    content: "An extensive international search and rescue operation continues in the Pacific Ocean for a commercial aircraft that went missing during a routine flight between major cities. The aircraft, carrying 180 passengers and crew members, lost contact with air traffic control approximately 400 nautical miles from its destination. Search teams from five countries have deployed ships, aircraft, and underwater vehicles in a coordinated effort to locate the missing plane. Weather conditions in the search area remain challenging, with high winds and rough seas hampering visibility and rescue operations.",
    imageUrl: "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "World",
    timeAgo: "1 hr ago",
    publishedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    author: "Aviation Correspondent",
    source: "GlobalNews",
    displayText: "🔍 DEVELOPING: International search continues for missing aircraft in Pacific Ocean"
  },
  {
    id: 'breaking-4',
    title: "Prime Minister announces ambitious new climate change initiative",
    summary: "Comprehensive plan includes renewable energy targets and carbon reduction measures.",
    content: "The Prime Minister unveiled an ambitious new climate change initiative today, outlining a comprehensive plan to achieve net-zero carbon emissions by 2035, five years ahead of the previous target. The initiative includes massive investments in renewable energy infrastructure, electric vehicle charging networks, and green technology research and development. The plan also introduces new regulations for industrial emissions and provides substantial incentives for businesses to adopt sustainable practices. Environmental groups have cautiously welcomed the announcement while calling for more detailed implementation timelines.",
    imageUrl: "https://images.pexels.com/photos/8828687/pexels-photo-8828687.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Politics",
    timeAgo: "2 hrs ago",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    author: "Political Correspondent",
    source: "GlobalNews",
    displayText: "🌍 BREAKING: Prime Minister announces ambitious new climate change initiative"
  }
];

class BreakingNewsStore {
  constructor() {
    this.data = null;
    this.loading = false;
    this.error = null;
    this.useAPI = false; // Toggle between mock data and API
  }

  // Fetch breaking news data
  async fetchBreakingNews() {
    this.loading = true;
    this.error = null;

    try {
      if (this.useAPI) {
        // TODO: Replace with actual API call when available
        // const response = await fetch('/api/breaking-news');
        // this.data = await response.json();
        throw new Error('API not implemented yet');
      } else {
        // Use mock data
        await this.simulateNetworkDelay();
        this.data = breakingNewsData;
      }
    } catch (error) {
      this.error = error.message;
      // Fallback to mock data on API error
      this.data = breakingNewsData;
    } finally {
      this.loading = false;
    }

    return {
      data: this.data,
      loading: this.loading,
      error: this.error
    };
  }

  // Get specific breaking news item by ID
  getBreakingNewsById(id) {
    if (!this.data) return null;
    return this.data.find(item => item.id === id);
  }

  // Simulate network delay for realistic loading states
  async simulateNetworkDelay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Toggle between API and mock data
  setUseAPI(useAPI) {
    this.useAPI = useAPI;
  }
}

// Export singleton instance
export const breakingNewsStore = new BreakingNewsStore();

// Export hook for React components
export function useBreakingNews() {
  return {
    fetchBreakingNews: () => breakingNewsStore.fetchBreakingNews(),
    getBreakingNewsById: (id) => breakingNewsStore.getBreakingNewsById(id),
    setUseAPI: (useAPI) => breakingNewsStore.setUseAPI(useAPI)
  };
}