// Technology Store - Entertainment-backed

const technologyData = { /* keep your mock here if you want fallback */ };

/* ------------------ helpers ------------------ */
const joinUrl = (base = "", path = "") =>
  `${String(base).replace(/\/+$/, "")}/${String(path).replace(/^\/+/, "")}`;

const toRelativeTime = (iso) => {
  if (!iso) return "";
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const diff = Date.now() - t;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} mins ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hrs ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d > 1 ? "s" : ""} ago`;
};

const capFirst = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
const safeId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const pick = (obj, keys) => keys.map(k => obj?.[k]).find(v => v != null);

const parseTags = (tags) => {
  if (Array.isArray(tags)) return tags.filter(Boolean).map(String);
  if (typeof tags === "string")
    return tags.split(",").map(t => capFirst(t.trim())).filter(Boolean);
  return [];
};

const readTimeLabel = (val) => {
  if (val == null) return "";
  const n = Number(val);
  if (!Number.isFinite(n)) return "";
  const mins = Math.max(1, Math.round(n)); // "2.29" -> 2
  return `${mins} min read`;
};

// map one API item -> UI story
const mapItem = (item) => {
  const id = String(pick(item, ["id", "_id"]) ?? safeId());
  const title = item?.title || "";
  const imageUrl = pick(item, ["image_banner", "medium_thumbnail", "image", "image_url"]) || "";
  const publishedAt = pick(item, ["published_at", "created_at", "publishedAt", "createdAt"]) || null;
  const tags = parseTags(item?.tags);

  // your badge shows category; normalize but keep original if not entertainment
  const rawCat = (item?.category_name || item?.category || "").toLowerCase();
  const category = rawCat.includes("entertain") ? "Entertainment"
                                                : (item?.category_name || item?.category || "Entertainment");

  return {
    id,
    title,
    summary: pick(item, ["image_caption", "summary", "description"]) || "",
    content: item?.content || "",
    imageUrl,
    category,
    timeAgo: toRelativeTime(publishedAt),
    publishedAt,
    author: item?.author || "Entertainment Desk",
    source: "News API",
    readTime: readTimeLabel(item?.read_time),
    views: "0",
    likes: 0,
    isBreaking:
      String(item?.top_news ?? "").toLowerCase() === "true" ||
      item?.top_news === true ||
      String(item?.featured_news ?? "").toLowerCase() === "true" ||
      item?.featured_news === true,
    tags
  };
};

// extract array from unknown JSON shape safely
const extractArray = (json) => {
  if (!json) return [];
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.data)) return json.data;
  if (Array.isArray(json.results)) return json.results;
  if (Array.isArray(json.articles)) return json.articles;
  if (Array.isArray(json?.data?.items)) return json.data.items;
  return [];
};

/* ------------------ store ------------------ */
class TechnologyStore {
  constructor() {
    this.data = null;
    this.loading = false;
    this.error = null;
    this.useAPI = true;
    this.useQueryFilter = false; // ← set true only if your API actually supports the query
  }

  async fetchTechnologyData() {
    this.loading = true;
    this.error = null;

    try {
      if (this.useAPI) {
        const BASE = import.meta.env.VITE_NEWS_API_BASE_URL;
        const PATH = import.meta.env.VITE_NEWS_API_PATH;
        if (!BASE || !PATH) {
          throw new Error("Set VITE_NEWS_API_BASE_URL and VITE_NEWS_API_PATH");
        }

        const pathWithQuery = this.useQueryFilter
          ? `${PATH}?category_name=Entertainment`
          : PATH;

        const url = joinUrl(BASE, pathWithQuery);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API ${res.status}`);
        const json = await res.json();

        const all = extractArray(json);

        // If server doesn't filter, filter here (fuzzy)
        const entertainment = this.useQueryFilter
          ? all
          : all.filter(it =>
              ((it?.category_name || it?.category || "").toLowerCase().includes("entertain"))
            );

        const mapped = entertainment.map(mapItem);

        // newest first
        mapped.sort((a, b) =>
          (new Date(b.publishedAt || 0).getTime()) - (new Date(a.publishedAt || 0).getTime())
        );

        const featuredStory = mapped[0] || null;
        const stories = mapped.slice(1);

        const tagSet = new Set(mapped.flatMap(s => s.tags || []));
        const categories = ["All", ...Array.from(tagSet)];

        // if API returns nothing, don't silently say "156" from mock without telling you
        if (!featuredStory && stories.length === 0) {
          console.warn("[TechnologyStore] No Entertainment items from API. Check endpoint/filters.");
        }

        this.data = (!featuredStory && stories.length === 0)
          ? {
              featuredStory: technologyData.featuredStory,
              stories: technologyData.stories,
              categories: technologyData.categories,
              stats: technologyData.stats
            }
          : {
              featuredStory,
              stories,
              categories,
              stats: {
                totalArticles: mapped.length,
                weeklyViews: "N/A",
                trending: categories[1] || "N/A",
                topCategory: "Entertainment"
              }
            };
      } else {
        await new Promise(r => setTimeout(r, 400));
        this.data = {
          featuredStory: technologyData.featuredStory,
          stories: technologyData.stories,
          categories: technologyData.categories,
          stats: technologyData.stats
        };
      }
    } catch (err) {
      this.error = err?.message || "Unknown error";
      console.error("[TechnologyStore] Fetch error:", this.error);
      this.data = {
        featuredStory: technologyData.featuredStory,
        stories: technologyData.stories,
        categories: technologyData.categories,
        stats: technologyData.stats
      };
    } finally {
      this.loading = false;
    }

    return { data: this.data, loading: this.loading, error: this.error };
  }

  // selectors (unchanged)
  getAllStories() {
    if (!this.data) return [];
    const { featuredStory, stories } = this.data;
    return [ ...(featuredStory ? [featuredStory] : []), ...(stories || []) ].filter(Boolean);
  }

  getStoriesByCategory(category) {
    if (!this.data || !category) return [];
    const all = this.getAllStories();
    if (category === "All") return all;
    return all.filter(s => Array.isArray(s.tags) &&
      s.tags.some(t => t.toLowerCase() === category.toLowerCase()));
  }

  getFeaturedStory() { return this.data ? this.data.featuredStory : null; }
  getRegularStories() { return this.data ? (this.data.stories || []) : []; }

  getCategories() {
    if (!this.data) return ["All"];
    const uniq = [...new Set((this.data.categories || []).filter(Boolean).map(t => t.trim()))];
    return ["All", ...uniq.filter(t => t !== "All")];
  }

  getStats() { return this.data ? this.data.stats : {}; }

  getTechnologyStoryById(id) {
    if (!this.data) return null;
    return this.getAllStories().find(s => s.id === id) || null;
  }

  searchByTags(tag) {
    if (!this.data) return [];
    return this.getAllStories().filter(
      s => s.tags && s.tags.some(t => t.toLowerCase().includes(String(tag).toLowerCase()))
    );
  }

  getTrendingStories() {
    if (!this.data) return [];
    const toNumber = (views) => {
      const m = String(views || "0").match(/^([\d.]+)\s*([kKmM])?$/);
      if (!m) return parseInt(views || 0, 10) || 0;
      const v = parseFloat(m[1]);
      const mult = m[2]?.toLowerCase() === "m" ? 1_000_000 : m[2]?.toLowerCase() === "k" ? 1_000 : 1;
      return v * mult;
    };
    return this.getAllStories()
      .slice()
      .sort((a, b) => (b.likes + toNumber(b.views)) - (a.likes + toNumber(a.views)))
      .slice(0, 3);
  }

  setUseAPI(v) { this.useAPI = v; }
}

export const technologyStore = new TechnologyStore();

export function useTechnology() {
  return {
    fetchTechnologyData: () => technologyStore.fetchTechnologyData(),
    getAllStories: () => technologyStore.getAllStories(),
    getStoriesByCategory: (category) => technologyStore.getStoriesByCategory(category),
    getFeaturedStory: () => technologyStore.getFeaturedStory(),
    getRegularStories: () => technologyStore.getRegularStories(),
    getCategories: () => technologyStore.getCategories(),
    getStats: () => technologyStore.getStats(),
    getTechnologyStoryById: (id) => technologyStore.getTechnologyStoryById(id),
    searchByTags: (tag) => technologyStore.searchByTags(tag),
    getTrendingStories: () => technologyStore.getTrendingStories(),
    setUseAPI: (v) => technologyStore.setUseAPI(v),
  };
}
