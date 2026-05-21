import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { blogPublicService } from '../blogPublicService';
import { useEntertainmentFallback } from '../store/entertainmentFallbackStore';





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

const Entertainment = () => {
  const [articles, setArticles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { fetch: fetchFallback } = useEntertainmentFallback();

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      let list = [];
      let blogs = [];

      // 1) Backend first
      try {
        const contentRes = await blogPublicService.getPublishedContentOnPages('Entertainment');
        const fromBackend = Array.isArray(contentRes?.contents) ? contentRes.contents : [];
        // strictly Entertainment
        list = fromBackend.filter(
          i => (i?.category_name || '').toLowerCase() === 'entertainment'
        );

        const blogRes = await blogPublicService.getPublishedBlogOnPages('Entertainment');
        blogs = Array.isArray(blogRes?.blogs) ? blogRes.blogs : [];
      } catch (err) {
        console.error('❌ Entertainment API fetch failed:', err);
      }

      // 2) Top up with fallback to ensure ≥ 20
      try {
        if (!list.length || list.length < 20) {
          const { items: fbItems, error } = await fetchFallback(20);
          if (error) console.warn('⚠️ Entertainment fallback warning:', error);

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
        console.error('❌ Entertainment fallback fetch failed:', fbErr);
      }

      if (!cancelled) {
        setArticles(list);
        setPosts(blogs);
        setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [fetchFallback]);

  if (loading) {
    return (
      <section className="bg-gray-100 py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">🎬 Entertainment</h2>
        <p className="text-center text-gray-500">Loading…</p>
      </section>
    );
  }

  return (
    <>
      {/* Entertainment Articles */}
      <section className="bg-gray-100 py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">🎬 Entertainment</h2>

        {articles.length === 0 ? (
          <p className="text-center text-gray-500">No entertainment articles available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {articles.map((item, idx) => {
              const category = item.category_name || item.category || 'Entertainment';
              const publishDate =
                item.publishDate || item.publishedAt || item.published_at || item.created_at || null;
              const timeAgo = formatTimeAgo(publishDate);

              return (
                <Link
                  to={`/entertainment/${item.slug || item._id}`}
                  key={idx}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden flex flex-col"
                >
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-52 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold text-lg text-gray-800">{item.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-red-600">{category}</p>
                      {timeAgo && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-500">{timeAgo}</span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Blogs Section */}
      <section className="bg-white py-12 px-4 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">📝 Entertainment Blogs</h2>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No blog posts found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-gray-50 rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
              >
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{post.title}</h3>
                  <p className="text-sm text-gray-600 flex-1">{post.summary}</p>
                  <div className="mt-4 text-xs text-gray-500">
                    By {post.author} •{' '}
                    {post.publishDate
                      ? new Date(post.publishDate).toLocaleDateString()
                      : 'Unknown Date'}
                  </div>
                  <button
                    onClick={() => navigate(`/blog/${post._id}`)}
                    className="mt-4 text-orange-600 hover:text-orange-700 font-semibold self-start"
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

export default Entertainment;
