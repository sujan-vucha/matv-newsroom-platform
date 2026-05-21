// src/stores/sportfitFallbackStore.js
// API-backed fallback for the Sports section.
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

// Map API item → component-friendly article
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
    category: item?.category_name || "Sports",         // ← shows "Sports"
    subCategory: item?.sub_category_name || "",        // e.g., "SportFit", "Football"
    author: item?.author || "Staff Reporter",
    publishDate: item?.published_at || item?.created_at || null,
    content: item?.content || "",
    summary: item?.image_caption || "",
    readTime: item?.read_time != null ? String(item.read_time) : "",
    isTop: toBool(item?.top_news),
    isFeatured: toBool(item?.featured_news),
    isSponsored: toBool(item?.sponsored),
    absoluteUrl: item?.absolute_url || "",
    tags: normTags(item?.tags),
    source: "News API",
  };
};

class SportfitFallbackStore {
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
   * Fetch Sports articles (strict: category_name === "Sports").
   * Keeps a few heuristics as backup (tags or title contain sport keywords).
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

      // Primary filter: category_name === "Sports"
      const sportsOnly = raw.filter(i =>
        (i?.category_name || "").toLowerCase() === "sports"
      );

      // Backup: tags/title include sport words (in case API is sparse)
      const byTagOrTitle = raw.filter(i => {
        const tags = normTags(i?.tags).map(t => t.toLowerCase());
        const t = (i?.title || "").toLowerCase();
        return tags.includes("sports") || tags.includes("sport") || t.includes("sport");
      });

      // Merge & de-dupe by (id/slug)
      const merged = [...sportsOnly, ...byTagOrTitle];
      const dedup = new Map();
      for (const it of merged) {
        const key = String(it?.id || it?.slug || safeId());
        if (!dedup.has(key)) dedup.set(key, it);
      }

      let mapped = Array.from(dedup.values()).map(mapItem);

      // Newest first
      mapped.sort((a, b) => {
        const da = a.publishDate ? new Date(a.publishDate).getTime() : 0;
        const db = b.publishDate ? new Date(b.publishDate).getTime() : 0;
        return db - da;
      });

      this.items = mapped.slice(0, Math.max(minCount, 50));
    } catch (e) {
      this.error = e?.message || "Unknown error";
      this.items = [];
      console.error("SportfitFallbackStore (Sports):", this.error);
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

export const sportfitFallbackStore = new SportfitFallbackStore();

export function useSportfitFallback() {
  return {
    fetch: (minCount = 20) => sportfitFallbackStore.fetch(minCount),
    fetchOne: (idOrSlug) => sportfitFallbackStore.fetchOne(idOrSlug),
    getAll: () => sportfitFallbackStore.getAll(),
    getByIdOrSlug: (v) => sportfitFallbackStore.getByIdOrSlug(v),
  };
}
