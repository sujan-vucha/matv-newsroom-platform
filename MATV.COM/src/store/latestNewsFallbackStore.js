// Fallback store for Latest News (ALL categories), ensures >= 20 items if needed.
// Env: VITE_NEWS_API_BASE_URL, VITE_NEWS_API_PATH

const joinUrl = (base = "", path = "") =>
  `${String(base).replace(/\/+$/, "")}/${String(path).replace(/^\/+/, "")}`;

const safeId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const slugify = (s = "") =>
  s.toLowerCase().trim()
    .replace(/["“”'’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const toBool = (v) => {
  if (typeof v === "boolean") return v;
  if (v == null) return false;
  const s = String(v).toLowerCase();
  return s === "true" || s === "1" || s === "yes";
};

const normTags = (tags) => {
  if (Array.isArray(tags)) return tags.filter(Boolean).map(String);
  if (typeof tags === "string") return tags.split(",").map(t => t.trim()).filter(Boolean);
  return [];
};

// Map API item -> your component shape
const mapItem = (item) => {
  const id = item?.id?.toString?.() ?? safeId();
  const title = item?.title || "";
  const slug = item?.slug || slugify(title);

  return {
    // list keys used by LatestNews.jsx
    _id: id,
    id,
    slug,
    title,
    imageUrl: item?.image_banner || item?.medium_thumbnail || "",
    category: item?.category_name || "News",

    // detail/extra
    author: item?.author || "ANI",
    publishDate: item?.published_at || item?.created_at || null,
    content: item?.content || "",
    summary: item?.image_caption || "",
    subCategory: item?.sub_category_name || "",
    readTime: item?.read_time != null ? String(item.read_time) : "",
    isTop: toBool(item?.top_news),
    isFeatured: toBool(item?.featured_news),
    isSponsored: toBool(item?.sponsored),
    absoluteUrl: item?.absolute_url || "",
    tags: normTags(item?.tags),
    source: "News API"
  };
};

class LatestNewsFallbackStore {
  constructor() {
    this.items = [];
    this.loading = false;
    this.error = null;
  }

  _env() {
    const BASE = import.meta.env.VITE_NEWS_API_BASE_URL;
    const PATH = import.meta.env.VITE_NEWS_API_PATH;
    if (!BASE || !PATH) throw new Error("Missing VITE_NEWS_API_BASE_URL or VITE_NEWS_API_PATH");
    return { BASE, PATH };
  }

  _find(val) {
    const key = String(val);
    return this.items.find(x => x._id === key || x.id === key || x.slug === key) || null;
  }

  async fetch(minCount = 20) {
    this.loading = true; this.error = null;

    try {
      const { BASE, PATH } = this._env();
      // If your API supports limit/sort, you can do:
      // const url = joinUrl(BASE, `${PATH}?limit=50&sort=published_at:desc`);
      const url = joinUrl(BASE, PATH);

      const res = await fetch(url, { method: "GET" });
      if (!res.ok) throw new Error(`News API failed: ${res.status}`);

      const json = await res.json();
      const raw = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];

      // Map everything (all categories)
      const mapped = raw.map(mapItem);

      // Sort newest first if date available
      mapped.sort((a, b) => {
        const da = a.publishDate ? new Date(a.publishDate).getTime() : 0;
        const db = b.publishDate ? new Date(b.publishDate).getTime() : 0;
        return db - da;
      });

      // Keep a healthy slice so we can top up to 20
      this.items = mapped.slice(0, Math.max(minCount, 50));
    } catch (e) {
      this.error = e?.message || "Unknown error";
      this.items = [];
      console.error("LatestNewsFallbackStore:", this.error);
    } finally {
      this.loading = false;
    }

    return {
      items: this.items,
      loading: this.loading,
      error: this.error
    };
  }

  async fetchOne(idOrSlug) {
    if (!this.items.length) await this.fetch(20);
    return this._find(idOrSlug);
  }

  getAll() { return this.items; }
  getByIdOrSlug(v) { return this._find(v); }
}

export const latestNewsFallbackStore = new LatestNewsFallbackStore();

export function useLatestNewsFallback() {
  return {
    fetch: (minCount = 20) => latestNewsFallbackStore.fetch(minCount),
    fetchOne: (idOrSlug) => latestNewsFallbackStore.fetchOne(idOrSlug),
    getAll: () => latestNewsFallbackStore.getAll(),
    getByIdOrSlug: (v) => latestNewsFallbackStore.getByIdOrSlug(v),
  };
}
