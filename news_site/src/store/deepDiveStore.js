// Deep Dive Store — fetches from the same ANI-style API
// and filters to ONLY "World" category items (case-insensitive).
// ENV used: VITE_NEWS_API_BASE_URL + VITE_NEWS_API_PATH

const FALLBACK_IMG =
  "https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=800";

// Fallback (used if API fails)
const deepDiveMockData = [
  {
    _id: "deepdive-1",
    title: "Sample World Analysis",
    summary:
      "This is a placeholder story shown when the API is unavailable.",
    content: "…",
    img: FALLBACK_IMG,
    category: "World",
    timeAgo: "3 hrs ago",
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    author: "News Desk",
    source: "Deep Dive",
    readTime: "6 min read",
  },
];

const WORLD_CATEGORY = "world"; // case-insensitive match

/* ---------- helpers ---------- */
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

function calcReadTime(html = "") {
  const wordsPerMinute = 200;
  const wordCount = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(wordCount / wordsPerMinute))} min read`;
}

function toArray(apiData) {
  if (Array.isArray(apiData)) return apiData;
  if (Array.isArray(apiData?.data)) return apiData.data;
  if (apiData && typeof apiData === "object") return [apiData];
  return [];
}

/* ---------- normalizer ---------- */
function normalizeANI(raw) {
  if (!raw || typeof raw !== "object") return null;

  const published =
    raw.published_at ||
    raw.created_at ||
    raw.updated_at ||
    new Date().toISOString();

  const content = raw.content || "";
  const summary =
    (raw.image_caption && String(raw.image_caption).trim()) ||
    (stripHtml(content).slice(0, 220) +
      (stripHtml(content).length > 220 ? "…" : "")) ||
    raw.title ||
    "—";

  // crypto.randomUUID guard
  const genId =
    (typeof crypto !== "undefined" &&
      crypto.randomUUID &&
      crypto.randomUUID()) ||
    String(Date.now()) + Math.random().toString(16).slice(2);

  return {
    _id: String(raw._id ?? raw.id ?? genId),
    title: raw.title || "Untitled",
    summary,
    content,
    img: raw.image_banner || raw.image_medium || raw.image || FALLBACK_IMG,
    category: raw.category_name || raw.sub_category_name || "News",
    timeAgo: getTimeAgo(published),
    publishedAt: published,
    author: raw.author || "ANI",
    source: "Deep Dive",
    readTime: calcReadTime(content),
    url: raw.absolute_url || raw.url,
  };
}

/* ---------- the store ---------- */
class DeepDiveStore {
  constructor() {
    this.data = null;       // array of deep dive items
    this.loading = false;
    this.error = null;
    this.useAPI = true;     // toggle for mock vs API
    this.limit = 12;        // optional: max items to keep
  }

  async fetchDeepDiveData() {
    this.loading = true;
    this.error = null;

    try {
      if (!this.useAPI) {
        this.data = deepDiveMockData;
        return { data: this.data, loading: (this.loading = false), error: this.error };
      }

      const base = import.meta.env.VITE_NEWS_API_BASE_URL || "";
      const path = import.meta.env.VITE_NEWS_API_PATH || "/news/business";
      const url = `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

      // Fetch
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Ensure JSON
      const ct = res.headers.get("content-type") || "";
      if (!ct.toLowerCase().includes("application/json")) {
        const text = await res.text();
        throw new Error(`Expected JSON, got ${ct || "unknown"}: ${text.slice(0, 180)}…`);
      }

      // Parse + normalize
      const json = await res.json();
      const normalized = toArray(json).map(normalizeANI).filter(Boolean);

      // Filter to WORLD only (category_name / sub_category_name)
      const worldOnly = normalized.filter((item) => {
        const cat = (item.category || "").toLowerCase();
        return cat === WORLD_CATEGORY;
      });

      // Optional: sort latest first if your API isn’t already sorted
      worldOnly.sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

      // Optional: limit count
      const trimmed = this.limit ? worldOnly.slice(0, this.limit) : worldOnly;

      // Fallback if filter produced nothing
      this.data = trimmed.length ? trimmed : deepDiveMockData;
    } catch (err) {
      console.error("Deep Dive API Error:", err);
      this.error = err?.message || "Failed to fetch Deep Dive data";
      this.data = deepDiveMockData;
    } finally {
      this.loading = false;
    }

    return { data: this.data, loading: this.loading, error: this.error };
  }

  // selectors
  getDeepDiveById(id) {
    if (!this.data) return null;
    return this.data.find((item) => item._id === id);
  }

  getDeepDiveByCategory(category) {
    if (!this.data) return [];
    return this.data.filter(
      (item) => (item.category || "").toLowerCase() === (category || "").toLowerCase()
    );
  }

  // utilities
  setUseAPI(useAPI) {
    this.useAPI = !!useAPI;
  }
  setLimit(n) {
    this.limit = Number.isFinite(n) ? n : this.limit;
  }
}

export const deepDiveStore = new DeepDiveStore();

export function useDeepDive() {
  return {
    fetchDeepDiveData: () => deepDiveStore.fetchDeepDiveData(),
    getDeepDiveById: (id) => deepDiveStore.getDeepDiveById(id),
    getDeepDiveByCategory: (category) => deepDiveStore.getDeepDiveByCategory(category),
    setUseAPI: (useAPI) => deepDiveStore.setUseAPI(useAPI),
    setLimit: (n) => deepDiveStore.setLimit(n),
  };
}
