// ✅ TopStoriesStore.js — Final version
// Fetches data from ANI API, shows only "National" category,
// correctly loads images (image_banner / medium_thumbnail),
// and uses env vars: VITE_NEWS_API_BASE_URL & VITE_NEWS_API_PATH.

const topStoriesData = {
  mainStories: [
    {
      id: "mock-1",
      title: "Example headline when API not available",
      summary: "Mock data for fallback display.",
      content: "This story will appear when API fails or returns no National stories.",
      imageUrl:
        "https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "National",
      timeAgo: "1 hr ago",
      author: "Mock Author",
      source: "Mock Source",
    },
  ],
  bottomStories: [],
};

// 🧹 Removes HTML tags safely
function stripHtml(input = "") {
  return String(input)
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export class TopStoriesStore {
  constructor() {
    this.data = null;
    this.loading = false;
    this.error = null;
    this.useAPI = true;
  }

  async fetchTopStoriesData() {
    this.loading = true;
    this.error = null;

    try {
      if (this.useAPI) {
        const base = import.meta.env.VITE_NEWS_API_BASE_URL || "";
        const path = import.meta.env.VITE_NEWS_API_PATH || "/news/business";
        const url = `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

        console.log("[TopStories] Fetch URL:", url);
        const res = await fetch(url, { headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        this.data = this.transformApiData(data);
      } else {
        this.data = topStoriesData;
      }
    } catch (err) {
      console.error("[TopStories] Error:", err);
      this.error = err.message;
      this.data = topStoriesData;
    } finally {
      this.loading = false;
    }

    return { data: this.data, loading: this.loading, error: this.error };
  }

  // 🧠 Detect & fix image URLs from multiple fields
  normalizeImage(content) {
    const base = import.meta.env.VITE_NEWS_API_BASE_URL || "";
    const rawUrl =
      content.image_banner ||
      content.medium_thumbnail ||
      content.image_url ||
      content.image ||
      content.imageUrl ||
      "";

    if (!rawUrl) {
      return "https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=800";
    }

    if (rawUrl.startsWith("http")) return rawUrl;
    return `${base.replace(/\/$/, "")}${rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`}`;
  }

  // 🧩 Transform and filter API data
  transformApiData(apiData) {
    const list = Array.isArray(apiData?.data) ? apiData.data : Array.isArray(apiData) ? apiData : [];

    if (!list.length) {
      console.warn("[TopStories] Empty or invalid response.");
      return topStoriesData;
    }

    // ✅ Filter only "National"
    const national = list.filter((item) => {
      const cat = (item.category_name || item.category || "").toString().toLowerCase();
      return cat.includes("national");
    });

    if (!national.length) {
      console.warn("[TopStories] No National stories found.");
      return topStoriesData;
    }

    // 🕒 Sort by newest first
    national.sort(
      (a, b) =>
        new Date(b.published_at || b.created_at) - new Date(a.published_at || a.created_at)
    );

    const mains = national.slice(0, 2);
    const bottoms = national.slice(2);

    return {
      mainStories: mains.map((content, i) => ({
        id: content.id || `main-${i}`,
        title: stripHtml(content.title || "Untitled"),
        summary:
          content.meta_description ||
          stripHtml(content.content || "").slice(0, 200),
        content: content.content,
        imageUrl: this.normalizeImage(content),
        category: content.category_name || "National",
        timeAgo: this.getTimeAgo(content.published_at || content.created_at),
        author: content.author || "ANI",
        source: "ANI News",
      })),
      bottomStories: bottoms.map((content, i) => ({
        id: content.id || `bottom-${i}`,
        title: stripHtml(content.title || "Untitled"),
        summary:
          content.meta_description ||
          stripHtml(content.content || "").slice(0, 200),
        content: content.content,
        imageUrl: this.normalizeImage(content),
        category: content.category_name || "National",
        timeAgo: this.getTimeAgo(content.published_at || content.created_at),
        author: content.author || "ANI",
        source: "ANI News",
      })),
    };
  }

  // 🕒 Relative time formatting
  getTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now - date) / (1000 * 60 * 60));
    if (diff < 1) return "Just now";
    if (diff < 24) return `${diff} hrs ago`;
    return `${Math.floor(diff / 24)} days ago`;
  }

  setUseAPI(flag) {
    this.useAPI = !!flag;
  }
}

// Export single instance + hook
export const topStoriesStore = new TopStoriesStore();

export function useTopStories() {
  return {
    fetchTopStoriesData: () => topStoriesStore.fetchTopStoriesData(),
    setUseAPI: (flag) => topStoriesStore.setUseAPI(flag),
  };
}
