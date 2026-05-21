// More to Explore Store – ENV-ready + ANI-style mapper (JavaScript)

/** Fallback images */
const FALLBACK_IMG_SM =
  "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800";
const FALLBACK_IMG_LG =
  "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1200";

/** ------------ helpers ------------ */
function stripHtml(input = "") {
  return String(input)
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getTimeAgo(dateString) {
  try {
    const now = new Date();
    const date = new Date(dateString || Date.now());
    const diffMs = now.getTime() - date.getTime();
    const hours = Math.floor(diffMs / 36e5);
    if (!Number.isFinite(hours) || hours < 1) return "Just now";
    if (hours < 24) return `${hours} hrs ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  } catch {
    return "Just now";
  }
}

function toArray(apiData) {
  if (Array.isArray(apiData)) return apiData;
  if (Array.isArray(apiData?.data)) return apiData.data;
  if (apiData && typeof apiData === "object") return [apiData];
  return [];
}

function normalizeANI(raw) {
  if (!raw || typeof raw !== "object") return null;

  const published =
    raw.published_at || raw.created_at || raw.updated_at || new Date().toISOString();

  const contentClean = stripHtml(raw.content || "");
  const summaryBase =
    (raw.image_caption && String(raw.image_caption).trim()) ||
    (contentClean ? contentClean.slice(0, 220) + (contentClean.length > 220 ? "…" : "") : "") ||
    raw.title ||
    "—";

  // safe id generator if crypto.randomUUID is unavailable
  const genId =
    (typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID()) ||
    String(Date.now()) + Math.random().toString(16).slice(2);

  return {
    id: String(raw.id ?? raw._id ?? genId),
    title: raw.title || "Untitled",
    summary: summaryBase,
    content: raw.content || "",
    imageUrl: raw.image_banner || raw.image_medium || raw.image || FALLBACK_IMG_SM,
    category: raw.category_name || raw.sub_category_name || "News",
    timeAgo: getTimeAgo(published),
    publishedAt: published,
    author: raw.author || "News Desk",
    source: raw.source || "ANI",
    url: raw.absolute_url || raw.url,
    tags: Array.isArray(raw.tags)
      ? raw.tags
      : typeof raw.tags === "string"
      ? raw.tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
    slug: raw.slug,
  };
}

/** ------------ fallback (if API fails) ------------ */
const fallbackData = {
  mainStory: {
    left: {
      id: "fallback-left",
      title: "Loading…",
      summary: "Fetching the latest stories for you.",
      content: "",
      imageUrl: FALLBACK_IMG_SM,
      category: "Latest",
      timeAgo: "Just now",
      publishedAt: new Date().toISOString(),
      author: "News Desk",
      source: "App",
    },
    center: { imageUrl: FALLBACK_IMG_LG, alt: "Latest News" },
    right: {
      id: "fallback-right",
      title: "More News Coming Soon",
      summary: "Stay tuned for more updates.",
      content: "",
      imageUrl: FALLBACK_IMG_SM,
      category: "News",
      timeAgo: "Just now",
      publishedAt: new Date().toISOString(),
      author: "News Desk",
      source: "App",
    },
  },
  bottomStories: [],
  additionalStories: [],
};

/** ------------ Store ------------ */
class MoreToExploreStore {
  constructor() {
    this.data = null;
    this.loading = false;
    this.error = null;
    this.useAPI = true; // toggle if you want to force fallbackData
  }

  async fetchMoreToExploreData() {
    this.loading = true;
    this.error = null;

    try {
      if (this.useAPI) {
        const base = import.meta.env.VITE_NEWS_API_BASE_URL || "";
        const path = import.meta.env.VITE_NEWS_API_PATH || "/news";
        const url = `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

        console.log("Fetching news from:", url);

        const res = await fetch(url, { headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const apiData = await res.json();
        this.data = this.transformApiData(apiData);
      } else {
        this.data = fallbackData;
      }
    } catch (err) {
      console.error("API fetch failed. Falling back to mock data:", err);
      this.error = err?.message || "Failed to fetch";
      this.data = fallbackData;
    } finally {
      this.loading = false;
    }

    return { data: this.data, loading: this.loading, error: this.error };
  }

  getAllStories() {
    if (!this.data) return [];
    const s = [];
    s.push(this.data.mainStory.left);
    s.push(this.data.mainStory.right);
    s.push(...this.data.bottomStories);
    s.push(...this.data.additionalStories);
    return s;
  }

  getStoriesByCategory(category) {
    const all = this.getAllStories();
    return all.filter(
      (s) => (s.category || "").toLowerCase() === (category || "").toLowerCase()
    );
  }

  setUseAPI(v) {
    this.useAPI = !!v;
  }

  transformApiData(apiData) {
    const arr = toArray(apiData);
    const items = arr.map((it) => normalizeANI(it)).filter(Boolean);

    if (!items.length) return fallbackData;

    const left = items[0];
    const right =
      items[1] || {
        id: "api-main-right",
        title: "More News Coming Soon",
        summary: "Stay tuned for more updates",
        content: "",
        imageUrl: FALLBACK_IMG_SM,
        category: "News",
        timeAgo: "Just now",
        publishedAt: new Date().toISOString(),
        author: "News Desk",
        source: "App",
      };

    return {
      mainStory: {
        left,
        center: {
          imageUrl: left?.imageUrl || FALLBACK_IMG_LG,
          alt: left?.title || "Latest News",
        },
        right,
      },
      bottomStories: items.slice(2, 6),
      additionalStories: items.slice(6),
    };
  }
}

/** singleton + tiny hook-like API */
export const moreToExploreStore = new MoreToExploreStore();

export function useMoreToExplore() {
  return {
    fetchMoreToExploreData: () => moreToExploreStore.fetchMoreToExploreData(),
    getAllStories: () => moreToExploreStore.getAllStories(),
    getStoriesByCategory: (category) => moreToExploreStore.getStoriesByCategory(category),
    setUseAPI: (useAPI) => moreToExploreStore.setUseAPI(useAPI),
  };
}
