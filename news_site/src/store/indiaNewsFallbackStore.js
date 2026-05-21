// src/stores/indiaNewsFallbackStore.js
// Fallback store for India News (category_name = "National") using your News API.
// Env vars required: VITE_NEWS_API_BASE_URL, VITE_NEWS_API_PATH

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

// Map API item -> component friendly shape (strict to your API keys)
const mapItem = (item) => {
  const id = item?.id?.toString?.() ?? safeId();
  const title = item?.title || "";
  const slug = item?.slug || slugify(title);
  const contentHtml = item?.content || "";

  return {
    // list keys used by IndiaNews.jsx
    _id: id,
    id,
    slug,
    title,
    imageUrl: item?.image_banner || item?.medium_thumbnail || "",
    category: item?.category_name || "National",

    // detail/extra
    author: item?.author || "ANI",
    publishDate: item?.published_at || item?.created_at || null,
    content: contentHtml,
    summary: item?.image_caption || "",
    subCategory: item?.sub_category_name || "",
    readTime: item?.read_time != null ? String(item.read_time) : "", // optional if you show it later
    isTop: toBool(item?.top_news),
    isFeatured: toBool(item?.featured_news),
    isSponsored: toBool(item?.sponsored),
    absoluteUrl: item?.absolute_url || "",
    tags: normTags(item?.tags),
    source: "News API"
  };
};

class IndiaNewsFallbackStore {
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
   * Fetch National news from the News API, ensure at least minCount (default 20).
   * If your API supports server-side filters, switch url to:
   *   const url = joinUrl(BASE, `${PATH}?category=National`);
   */
  async fetch(minCount = 20) {
    this.loading = true; this.error = null;

    try {
      const { BASE, PATH } = this._env();
      const url = joinUrl(BASE, PATH);
      const res = await fetch(url, { method: "GET" });
      if (!res.ok) throw new Error(`News API failed: ${res.status}`);

      const json = await res.json();
      const raw = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];

      // Keep only category_name === "National"
      const nationalOnly = raw.filter(i =>
        (i?.category_name || "").toLowerCase() === "national"
      );

      let mapped = nationalOnly.map(mapItem);

      // Newest first if dates exist
      mapped.sort((a, b) => {
        const da = a.publishDate ? new Date(a.publishDate).getTime() : 0;
        const db = b.publishDate ? new Date(b.publishDate).getTime() : 0;
        return db - da;
      });

      // Ensure we have a decent buffer; keep top N (>= minCount)
      this.items = mapped.slice(0, Math.max(minCount, 50));
    } catch (e) {
      this.error = e?.message || "Unknown error";
      this.items = [];
      console.error("IndiaNewsFallbackStore:", this.error);
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

export const indiaNewsFallbackStore = new IndiaNewsFallbackStore();

export function useIndiaNewsFallback() {
  return {
    fetch: (minCount = 20) => indiaNewsFallbackStore.fetch(minCount),
    fetchOne: (idOrSlug) => indiaNewsFallbackStore.fetchOne(idOrSlug),
    getAll: () => indiaNewsFallbackStore.getAll(),
    getByIdOrSlug: (v) => indiaNewsFallbackStore.getByIdOrSlug(v),
  };
}
