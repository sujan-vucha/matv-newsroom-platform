// Main store index - central export point for all stores
import { breakingNewsStore, useBreakingNews } from './breakingNewsStore.js';
import { moreToExploreStore, useMoreToExplore } from './moreToExploreStore.js';
import { topStoriesStore, useTopStories } from './topStoriesStore.js';
import { deepDiveStore, useDeepDive } from './deepDiveStore.js';
import { communityStore, useCommunity } from './communityStore.js';
import { moneyStore, useMoney } from './moneyStore.js';
import { sportsStore, useSports } from './sportsStore.js';
import { technologyStore, useTechnology } from './technologyStore.js';

// Export all stores and hooks
export { breakingNewsStore, useBreakingNews };
export { moreToExploreStore, useMoreToExplore };
export { topStoriesStore, useTopStories };
export { deepDiveStore, useDeepDive };
export { communityStore, useCommunity };
export { moneyStore, useMoney };
export { sportsStore, useSports };
export { technologyStore, useTechnology };





// Store configuration and exports
export * from './newsStore';
export * from './authorStore';




// Global store configuration
class GlobalStore {
  constructor() {
    this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
    this.useAPI = false; // Global toggle for API usage
  }

  // Enable API mode for all stores
  enableAPI(baseUrl = null) {
    if (baseUrl) {
      this.apiBaseUrl = baseUrl;
    }
    this.useAPI = true;
    
    // Update all stores
    breakingNewsStore.setUseAPI(true);
    moreToExploreStore.setUseAPI(true);
    topStoriesStore.setUseAPI(true);
    deepDiveStore.setUseAPI(true);
    communityStore.setUseAPI(true);
    moneyStore.setUseAPI(true);
    sportsStore.setUseAPI(true);
    technologyStore.setUseAPI(true);
  }

  // Disable API mode (use mock data)
  disableAPI() {
    this.useAPI = false;
    
    // Update all stores
    breakingNewsStore.setUseAPI(false);
    moreToExploreStore.setUseAPI(false);
    topStoriesStore.setUseAPI(false);
    deepDiveStore.setUseAPI(false);
    communityStore.setUseAPI(false);
    moneyStore.setUseAPI(false);
    sportsStore.setUseAPI(false);
    technologyStore.setUseAPI(false);
  }

  // Get current configuration
  getConfig() {
    return {
      apiBaseUrl: this.apiBaseUrl,
      useAPI: this.useAPI
    };
  }
}

// Export singleton instance
export const globalStore = new GlobalStore();

// Utility function to search across all stories
export async function searchAllStories(query) {
  const allStories = [];
  
  // Get data from all stores
  const breakingNews = await breakingNewsStore.fetchBreakingNews();
  const moreToExplore = await moreToExploreStore.fetchMoreToExploreData();
  const topStories = await topStoriesStore.fetchTopStoriesData();
  const deepDive = await deepDiveStore.fetchDeepDiveData();
  const community = await communityStore.fetchCommunityData();
  const money = await moneyStore.fetchMoneyData();
  const sports = await sportsStore.fetchSportsData();
  const technology = await technologyStore.fetchTechnologyData();
  
  // Combine all stories
  if (breakingNews.data) allStories.push(...breakingNews.data);
  if (moreToExplore.data) allStories.push(...moreToExploreStore.getAllStories());
  if (topStories.data) allStories.push(...topStoriesStore.getAllStories());
  if (deepDive.data) allStories.push(...deepDive.data);
  if (community.data) allStories.push(...communityStore.getAllStories());
  if (money.data) allStories.push(...money.data);
  if (sports.data) allStories.push(...sportsStore.getAllNews());
  if (technology.data) allStories.push(...technologyStore.getAllStories());
  
  // Filter by query
  const lowercaseQuery = query.toLowerCase();
  return allStories.filter(story => 
    story.title.toLowerCase().includes(lowercaseQuery) ||
    story.summary.toLowerCase().includes(lowercaseQuery) ||
    story.category.toLowerCase().includes(lowercaseQuery)
  );
}