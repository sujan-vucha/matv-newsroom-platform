// Fallback for World category — strict mapping to your API keys.

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
  if (typeof tags === "string") {
    return tags.split(",").map(t => t.trim()).filter(Boolean);
  }
  return [];
};

const mapWorldItem = (item) => {
  const id = item?.id?.toString?.() ?? safeId();
  const title = item?.title || "";
  const slug = item?.slug || slugify(title);

  return {
    // LIST KEYS used by WorldNews.jsx
    _id: id,                                // your list uses _id or slug
    id,
    slug,
    title,
    imageUrl: item?.image_banner || item?.medium_thumbnail || "", // strict keys
    category: item?.category_name || "World",

    // DETAIL/EXTRA KEYS used by WorldNewsDetail.jsx
    author: item?.author || "ANI",
    publishDate: item?.published_at || item?.created_at || null,
    content: item?.content || "",           // already HTML (with \u003C escapes in JSON)
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

class WorldNewsFallbackStore {
  constructor() {
    this.items = [];   // mapped World stories
    this.blogs = [];   // left empty unless you wire a blog fallback too
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

  async fetch() {
    this.loading = true; this.error = null;

    try {
      const { BASE, PATH } = this._env();
      // If your API supports server filter: const url = joinUrl(BASE, `${PATH}?category=World`);
      const url = joinUrl(BASE, PATH);
      const res = await fetch(url, { method: "GET" });
      if (!res.ok) throw new Error(`News API failed: ${res.status}`);

      const json = await res.json();
      const raw = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];

      // Strict filter by category_name === "World"
      const worldOnly = raw.filter(i => (i?.category_name || "").toLowerCase() === "world");

      this.items = worldOnly.map(mapWorldItem);
      this.blogs = []; // optional: keep empty
      // console.log('World fallback count:', this.items.length);
    } catch (e) {
      this.error = e?.message || "Unknown error";
      this.items = [];
      this.blogs = [];
      console.error("WorldNewsFallbackStore error:", this.error);
    } finally {
      this.loading = false;
    }

    // Back-compat for components expecting { worldNews, blogs }
    return {
      items: this.items,
      worldNews: this.items,
      blogs: this.blogs,
      loading: this.loading,
      error: this.error
    };
  }

  async fetchOne(idOrSlug) {
    if (!this.items.length) await this.fetch();
    return this._find(idOrSlug);
  }

  // getters
  getAll() { return this.items; }
  getBlogs() { return this.blogs; }
  getByIdOrSlug(v) { return this._find(v); }
}

export const worldNewsFallbackStore = new WorldNewsFallbackStore();

export function useWorldNewsFallback() {
  return {
    fetch: () => worldNewsFallbackStore.fetch(),
    fetchOne: (idOrSlug) => worldNewsFallbackStore.fetchOne(idOrSlug),
    getAll: () => worldNewsFallbackStore.getAll(),
    getBlogs: () => worldNewsFallbackStore.getBlogs(),
    getByIdOrSlug: (v) => worldNewsFallbackStore.getByIdOrSlug(v),
  };
}
