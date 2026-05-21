// Sports Store - handles data fetching and state management

// (kept only for structure reference; we won't fall back to it)
const sportsData = {
  news: [],
  liveScores: [],
  categories: ["All", "Football", "Tennis", "Cricket", "Olympics", "Formula 1", "Basketball"],
  stats: { matchesToday: 12, liveMatches: 2, totalViews: "0", totalArticles: 0 }
};

// ---------- helpers ----------
const joinUrl = (base = "", path = "") =>
  `${String(base).replace(/\/+$/, "")}/${String(path).replace(/^\/+/, "")}`;

const toRelativeTime = (iso) => {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hrs ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

const safeId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const capFirst = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

// Map a single API item -> your news card shape
const mapNewsItem = (item) => {
  const tags = Array.isArray(item?.tags)
    ? item.tags
    : typeof item?.tags === "string"
      ? item.tags.split(",").map((t) => capFirst(t.trim())).filter(Boolean)
      : [];

  return {
    id: item?.id?.toString?.() ?? safeId(),
    title: item?.title || "",
    summary: item?.image_caption || item?.summary || "",
    content: item?.content || "",
    category: item?.category_name || "Sports",
    img: item?.image_banner || item?.medium_thumbnail || item?.image || "",
    featured: Boolean(item?.top_news === "True" || item?.featured_news === "True"),
    timeAgo: toRelativeTime(item?.published_at || item?.created_at),
    publishedAt: item?.published_at || item?.created_at || null,
    author: item?.author || "Sports Desk",
    source: "News API",
    views: "0",
    likes: 0,
    isLive: false,
    tags
  };
};

class SportsStore {
  constructor() {
    this.data = null;
    this.loading = false;
    this.error = null;
    this.useAPI = true;
  }

  async fetchSportsData() {
    this.loading = true;
    this.error = null;

    try {
      if (this.useAPI) {
        const BASE = import.meta.env.VITE_NEWS_API_BASE_URL;
        const PATH = import.meta.env.VITE_NEWS_API_PATH;
        if (!BASE || !PATH) {
          throw new Error("News API env vars missing. Set VITE_NEWS_API_BASE_URL and VITE_NEWS_API_PATH.");
        }

        // If your backend supports query filtering, you can append ?category=Sports
        // const url = joinUrl(BASE, `${PATH}?category=Sports`);
        const url = joinUrl(BASE, PATH);

        const res = await fetch(url, { method: "GET" });
        if (!res.ok) throw new Error(`API request failed: ${res.status}`);

        const json = await res.json();
        const items = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];

        // 🔎 Keep only Sports category
        const sportsOnly = items.filter(
          (it) => (it?.category_name || "").toLowerCase() === "sports"
        );

        const mapped = sportsOnly.map(mapNewsItem);

        // Build categories from tags (plus "All")
        const tagCats = [
          ...new Set(mapped.flatMap((n) => n.tags || []).filter(Boolean))
        ];
        const categories = ["All", ...tagCats];

        // Live score area can be wired later; keeping empty array here
        const liveScores = [];

        this.data = {
          news: mapped,
          liveScores,
          categories,
          stats: {
            matchesToday: sportsData.stats.matchesToday,
            liveMatches: liveScores.filter((m) => m.status === "live").length,
            totalViews: this.getTotalViews(mapped),
            totalArticles: mapped.length
          }
        };
      } else {
        await this.simulateNetworkDelay();
        this.data = sportsData;
      }
    } catch (err) {
      this.error = err?.message || "Unknown error";
      this.data = null; // ❌ do not fallback to mock as per your original file
      console.error("❌ Error fetching sports data:", this.error);
    } finally {
      this.loading = false;
    }

    return { data: this.data, loading: this.loading, error: this.error };
  }

  // ----- utils used by store -----
  formatViews(num) {
    const n = Number(num || 0);
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return `${n}`;
  }

  getTotalViews(newsArray) {
    // views are strings like "2.1M"/"123K" in your UI; we default to 0 for API items
    const total = (newsArray || []).reduce((sum, item) => {
      const raw = item.views || "0";
      if (typeof raw === "number") return sum + raw;
      const m = String(raw).match(/^([\d.]+)\s*([kKmM])?$/);
      if (!m) return sum + (parseInt(raw, 10) || 0);
      const v = parseFloat(m[1]);
      const mult = m[2]?.toLowerCase() === "m" ? 1_000_000 : m[2]?.toLowerCase() === "k" ? 1_000 : 1;
      return sum + v * mult;
    }, 0);
    return this.formatViews(total);
  }

  async simulateNetworkDelay(ms = 800) {
    return new Promise((r) => setTimeout(r, ms));
  }

  setUseAPI(useAPI) { this.useAPI = useAPI; }

  // ----- getters -----
  getAllNews() { return this.data ? this.data.news : []; }

  getNewsByCategory(category) {
    if (!this.data) return [];
    if (category === "All") return this.data.news;
    return this.data.news.filter((n) =>
      (n.tags || []).map((t) => t.toLowerCase()).includes(String(category).toLowerCase())
    );
  }

  getFeaturedNews() {
    if (!this.data || !this.data.news.length) return null;
    return this.data.news.find((n) => n.featured) || this.data.news[0];
  }

  getLiveScores() { return this.data ? this.data.liveScores : []; }
  getLiveMatches() { return this.getLiveScores().filter((m) => m.status === "live"); }
  getCategories() { return this.data ? this.data.categories : ["All"]; }
  getStats() { return this.data ? this.data.stats : {}; }
  getNewsById(id) { return this.data ? this.data.news.find((n) => n.id === id) : null; }

  searchByTags(tag) {
    if (!this.data) return [];
    return this.data.news.filter(
      (n) => n.tags && n.tags.some((t) => t.toLowerCase().includes(String(tag).toLowerCase()))
    );
  }

  updateLiveScores() {
    if (!this.data) return;
    this.data.liveScores = this.data.liveScores.map((m) => {
      if (m.status === "live") {
        const currentMinute = parseInt(m.time);
        if (currentMinute < 90) return { ...m, time: `${currentMinute + 1}'` };
      }
      return m;
    });
  }
}

// Export singleton
export const sportsStore = new SportsStore();

// Hook for components
export function useSports() {
  return {
    fetchSportsData: () => sportsStore.fetchSportsData(),
    getAllNews: () => sportsStore.getAllNews(),
    getNewsByCategory: (category) => sportsStore.getNewsByCategory(category),
    getFeaturedNews: () => sportsStore.getFeaturedNews(),
    getLiveScores: () => sportsStore.getLiveScores(),
    getLiveMatches: () => sportsStore.getLiveMatches(),
    getCategories: () => sportsStore.getCategories(),
    getStats: () => sportsStore.getStats(),
    getNewsById: (id) => sportsStore.getNewsById(id),
    searchByTags: (tag) => sportsStore.searchByTags(tag),
    updateLiveScores: () => sportsStore.updateLiveScores(),
    setUseAPI: (useAPI) => sportsStore.setUseAPI(useAPI)
  };
}
