// Fallback store for "General News" (sub_category_name) under your News API
// Uses envs: VITE_NEWS_API_BASE_URL, VITE_NEWS_API_PATH

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

const mapItem = (item) => {
  const id = item?.id?.toString?.() ?? safeId();
  const title = item?.title || "";
  const slug = item?.slug || slugify(title);

  return {
    // list keys
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

class GeneralNewsFallbackStore {
  constructor() {
    this.items = [];
    this.blogs = [];   // optional — left empty unless you wire one
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
      // If your endpoint supports filter: const url = joinUrl(BASE, `${PATH}?sub_category=General%20News`)
      const url = joinUrl(BASE, PATH);
      const res = await fetch(url, { method: "GET" });
      if (!res.ok) throw new Error(`News API failed: ${res.status}`);

      const json = await res.json();
      const raw = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];

      // keep only sub_category_name === "General News"
      const filtered = raw.filter(i =>
        (i?.sub_category_name || "").toLowerCase() === "general news"
      );

      this.items = filtered.map(mapItem);
      this.blogs = [];
      // console.log('General News count:', this.items.length);
    } catch (e) {
      this.error = e?.message || "Unknown error";
      this.items = [];
      this.blogs = [];
      console.error("GeneralNewsFallbackStore:", this.error);
    } finally {
      this.loading = false;
    }

    // Backward-compatible payload for list components
    return {
      items: this.items,
      news: this.items,        // alias if you prefer "news"
      worldNews: this.items,   // alias if some list expects this key
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

export const generalNewsFallbackStore = new GeneralNewsFallbackStore();

export function useGeneralNewsFallback() {
  return {
    fetch: () => generalNewsFallbackStore.fetch(),
    fetchOne: (idOrSlug) => generalNewsFallbackStore.fetchOne(idOrSlug),
    getAll: () => generalNewsFallbackStore.getAll(),
    getBlogs: () => generalNewsFallbackStore.getBlogs(),
    getByIdOrSlug: (v) => generalNewsFallbackStore.getByIdOrSlug(v),
  };
}
