// Shared news service: fetch once, normalize, and partition/claim items.
// Uses env: VITE_NEWS_API_BASE_URL + VITE_NEWS_API_PATH

const FALLBACK_IMG_SM =
  "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800";

let _fetchPromise = null;
let _articles = [];        // normalized list
let _claimedIds = new Set(); // dedupe across sections
let _lastError = null;

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

function safeId() {
  return (
    (typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID()) ||
    String(Date.now()) + Math.random().toString(16).slice(2)
  );
}

function normalizeANI(raw) {
  if (!raw || typeof raw !== "object") return null;

  const published =
    raw.published_at || raw.created_at || raw.updated_at || new Date().toISOString();

  const contentClean = stripHtml(raw.content || "");
  const summary =
    raw.image_caption?.trim() ||
    (contentClean ? contentClean.slice(0, 220) + (contentClean.length > 220 ? "…" : "") : "") ||
    raw.title ||
    "—";

  return {
    id: String(raw.id ?? raw._id ?? safeId()),
    title: raw.title || "Untitled",
    summary,
    content: raw.content || "",
    imageUrl: raw.image_banner || raw.image_medium || raw.image || FALLBACK_IMG_SM,
    category: raw.category_name || raw.sub_category_name || "News",
    timeAgo: getTimeAgo(published),
    publishedAt: published,
    author: raw.author || "ANI",
    source: raw.source || "ANI",
    url: raw.absolute_url || raw.url,
    slug: raw.slug,
  };
}

function toArray(apiData) {
  if (Array.isArray(apiData)) return apiData;
  if (Array.isArray(apiData?.data)) return apiData.data;
  if (apiData && typeof apiData === "object") return [apiData];
  return [];
}

// inside newsShared.js, replace ensureFetched() with this:

async function ensureFetched() {
  if (_fetchPromise) return _fetchPromise;

  _fetchPromise = (async () => {
    const base = import.meta.env.VITE_NEWS_API_BASE_URL || "";
    const path = import.meta.env.VITE_NEWS_API_PATH || "/news/business";
    const url = `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

    try {
      console.log("[newsShared] Fetching:", url);
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        // mode: "cors", // default in browsers; leave here commented for clarity
      });

      const ct = res.headers.get("content-type") || "";
      if (!res.ok) {
        const text = await res.text();
        console.error("[newsShared] HTTP error", res.status, text.slice(0, 200));
        throw new Error(`HTTP ${res.status} from ${url}`);
      }

      if (!/application\/json/i.test(ct)) {
        const text = await res.text();
        console.error("[newsShared] Non-JSON content-type:", ct, "sample:", text.slice(0, 200));
        throw new Error(`Non-JSON response (content-type: ${ct}) from ${url}`);
      }

      const json = await res.json();
      const arr = toArray(json).map(normalizeANI).filter(Boolean);

      if (!arr.length) {
        console.warn("[newsShared] JSON OK but no items. Sample:", JSON.stringify(json).slice(0, 200));
      }

      _articles = arr;
      _lastError = null;
      return _articles;
    } catch (err) {
      _lastError = err?.message || "Failed to fetch";
      _articles = [];
      console.error("[newsShared] Fetch failed:", _lastError);
      return _articles;
    }
  })();

  return _fetchPromise;
}


// Public API
export const newsShared = {
  /** Fetch (if not already) and return normalized list */
  async getAll() {
    await ensureFetched();
    return _articles.slice();
  },

  /** Claim up to `limit` items that aren't claimed yet. Optional filter fn. */
  async claim({ limit = Infinity, filter = null } = {}) {
    await ensureFetched();
    const out = [];
    for (const item of _articles) {
      if (_claimedIds.has(item.id)) continue;
      if (filter && !filter(item)) continue;
      out.push(item);
      _claimedIds.add(item.id);
      if (out.length >= limit) break;
    }
    return out;
  },

  /** Mark specific ids as claimed (if you already chose them) */
  markClaimed(ids = []) {
    ids.forEach((id) => _claimedIds.add(String(id)));
  },

  /** Clear claims (e.g., on route change if you need a fresh partition) */
  resetClaims() {
    _claimedIds.clear();
  },

  /** Get last error (if any) from fetch */
  getLastError() {
    return _lastError;
  },
};
