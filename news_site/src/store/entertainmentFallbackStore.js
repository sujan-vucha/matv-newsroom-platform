// src/stores/entertainmentFallbackStore.js
// Fallback store for "Entertainment" category articles using your API.
// Requires env vars: VITE_NEWS_API_BASE_URL and VITE_NEWS_API_PATH.

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

// Convert API item → usable article object
const mapItem = (item) => {
  const id = item?.id?.toString?.() ?? safeId();
  const title = item?.title || "";
  const slug = item?.slug || slugify(title);

  return {
    _id: id,
    id,
    slug,
    title,
    imageUrl: item?.image_banner || item?.medium_thumbnail || "",
    category: item?.category_name || "Entertainment",
    author: item?.author || "Staff Reporter",
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

class EntertainmentFallbackStore {
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

  /**
   * Fetch Entertainment category news from the API.
   * Filters strictly for category_name === "Entertainment".
   */
  async fetch(minCount = 20) {
    this.loading = true; this.error = null;

    try {
      const { BASE, PATH } = this._env();
      const url = joinUrl(BASE, PATH);
      const res = await fetch(url, { method: "GET" });
      if (!res.ok) throw new Error(`API failed: ${res.status}`);
      const json = await res.json();
      const raw = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];

      // Filter by Entertainment category
      const filtered = raw.filter(i =>
        (i?.category_name || "").toLowerCase() === "entertainment"
      );

      let mapped = filtered.map(mapItem);

      mapped.sort((a, b) => {
        const da = a.publishDate ? new Date(a.publishDate).getTime() : 0;
        const db = b.publishDate ? new Date(b.publishDate).getTime() : 0;
        return db - da;
      });

      this.items = mapped.slice(0, Math.max(minCount, 50));
    } catch (e) {
      this.error = e?.message || "Unknown error";
      this.items = [];
      console.error("EntertainmentFallbackStore:", this.error);
    } finally {
      this.loading = false;
    }

    return { items: this.items, loading: this.loading, error: this.error };
  }

  async fetchOne(idOrSlug) {
    if (!this.items.length) await this.fetch(20);
    return this._find(idOrSlug);
  }

  getAll() { return this.items; }
  getByIdOrSlug(v) { return this._find(v); }
}

export const entertainmentFallbackStore = new EntertainmentFallbackStore();

export function useEntertainmentFallback() {
  return {
    fetch: (minCount = 20) => entertainmentFallbackStore.fetch(minCount),
    fetchOne: (idOrSlug) => entertainmentFallbackStore.fetchOne(idOrSlug),
    getAll: () => entertainmentFallbackStore.getAll(),
    getByIdOrSlug: (v) => entertainmentFallbackStore.getByIdOrSlug(v),
  };
}
