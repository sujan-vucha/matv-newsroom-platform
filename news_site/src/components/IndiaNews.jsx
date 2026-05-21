import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { blogPublicService } from '../blogPublicService';
import { useIndiaNewsFallback } from '../store/indiaNewsFallbackStore';

// 🕒 “2 mins ago” / “3 hrs ago” / “1 day ago”
function formatTimeAgo(dateLike) {
  if (!dateLike) return '';
  const ts = new Date(dateLike).getTime();
  if (Number.isNaN(ts)) return '';
  const diffMs = Date.now() - ts;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

const IndiaNews = () => {
  const [news, setNews] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { fetch: fetchFallback } = useIndiaNewsFallback();

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      let list = [];
      let blogs = [];

      // 1) Backend first
      try {
        const contentRes = await blogPublicService.getPublishedContentOnPages('IndiaNews');
        const fromBackend = Array.isArray(contentRes?.contents) ? contentRes.contents : [];
        // keep only National
        list = fromBackend.filter(x => (x?.category_name || '').toLowerCase() === 'national');

        const blogRes = await blogPublicService.getPublishedBlogOnPages('IndiaNews');
        blogs = Array.isArray(blogRes?.blogs) ? blogRes.blogs : [];
      } catch (err) {
        console.error('❌ IndiaNews API fetch failed:', err);
      }

      // 2) Top up with fallback if needed (< 20 or empty)
      try {
        if (!list.length || list.length < 20) {
          const { items: fbItems, error } = await fetchFallback(20);
          if (error) console.warn('⚠️ Fallback warning:', error);

          // Deduplicate by _id / id / slug
          const seen = new Set(list.map(i => String(i._id || i.id || i.slug)));
          const toAdd = fbItems.filter(i => {
            const key = String(i._id || i.id || i.slug);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });

          list = [...list, ...toAdd].slice(0, Math.max(20, list.length));
        }
      } catch (fbErr) {
        console.error('❌ Fallback fetch failed:', fbErr);
      }

      if (!cancelled) {
        setNews(list);
        setPosts(blogs);
        setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [fetchFallback]);

  if (loading) {
    return (
      <section className="bg-white py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">🇮🇳 India News</h2>
        <p className="text-center text-gray-500">Loading…</p>
      </section>
    );
  }

  return (
    <>
      {/* 🇮🇳 India News Section */}
      <section className="bg-white py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">🇮🇳 India News</h2>

        {news.length === 0 ? (
          <p className="text-center text-gray-500">No India news available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.map((item, idx) => {
              const category = item.category_name || item.category || 'National';
              const publishDate =
                item.publishDate || item.publishedAt || item.published_at || item.created_at || null;
              const timeAgo = formatTimeAgo(publishDate);

              return (
                <Link
                  to={`/india-news/${item.slug || item._id}`}
                  key={idx}
                  className="flex gap-4 bg-gray-50 hover:bg-white rounded-xl shadow-sm hover:shadow-md p-4 transition-all duration-300"
                >
                  <div className="flex flex-col justify-between flex-grow">
                    <h4 className="text-lg font-semibold text-gray-800">{item.title}</h4>

                    {/* 🕒 Category + “x mins ago” */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-block text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full w-fit">
                        {category}
                      </span>
                      {timeAgo && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-500">{timeAgo}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-36 h-28 object-cover rounded-lg"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ✍️ Blog Section */}
      <section className="bg-gray-50 py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">📝 From the Blog</h2>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No blog posts found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden flex flex-col"
              >
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{post.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3 flex-grow">{post.summary}</p>
                  <div className="mt-4 text-xs text-gray-500">
                    By <span className="font-medium">{post.author}</span> •{' '}
                    {post.publishDate
                      ? new Date(post.publishDate).toLocaleDateString()
                      : 'Unknown Date'}
                  </div>
                  <button
                    onClick={() => navigate(`/blog/${post._id}`)}
                    className="mt-4 text-orange-600 hover:text-orange-700 font-semibold text-sm self-start"
                  >
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default IndiaNews;
