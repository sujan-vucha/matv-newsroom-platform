import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { blogPublicService } from '../blogPublicService';
import { useGeneralNewsFallback } from '../store/generalNewsFallbackStore'; // ✅ fallback

const ViralNews = () => {
  const [news, setNews] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { fetch: fetchFallback } = useGeneralNewsFallback();

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      let list = [];
      let blogs = [];

      // Try backend first
      try {
        const contentRes = await blogPublicService.getPublishedContentOnPages('ViralNews');
        list = Array.isArray(contentRes?.contents) ? contentRes.contents : [];

        const blogRes = await blogPublicService.getPublishedBlogOnPages('ViralNews');
        blogs = Array.isArray(blogRes?.blogs) ? blogRes.blogs : [];
      } catch (err) {
        console.error('❌ Backend ViralNews fetch failed:', err);
      }

      // If backend returned nothing, fallback to General News (sub_category_name)
      if (!list.length) {
        try {
          console.log('📰 Using General News fallback (sub_category_name = "General News")');
          const { items, blogs: fbBlogs, error } = await fetchFallback();
          if (error) console.warn('Fallback warning:', error);
          list = Array.isArray(items) ? items : [];
          blogs = blogs.length ? blogs : (fbBlogs || []);
        } catch (fbErr) {
          console.error('❌ Fallback fetch failed:', fbErr);
        }
      }

      if (!cancelled) {
        setNews(list);
        setPosts(blogs);
        setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Viral News</h2>
        <p className="text-center text-gray-500">Loading…</p>
      </section>
    );
  }

  return (
    <>
      {/* Viral News Section */}
      <section className="bg-white py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10"> Viral News</h2>

        {news.length === 0 ? (
          <p className="text-center text-gray-500">No Viral News available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.map((item, idx) => (
              <Link
                to={`/viral/${item.slug || item._id}`}
                key={idx}
                className="flex gap-4 bg-gray-50 hover:bg-white transition-all duration-300 rounded-xl shadow-sm hover:shadow-md p-4"
              >
                <div className="flex flex-col justify-between flex-grow">
                  <h4 className="text-lg font-semibold text-gray-800">{item.title}</h4>
                  {/* <span className="inline-block text-xs mt-2 bg-red-100 text-red-600 px-2 py-1 rounded-full w-fit">
                    {item.category}
                  </span> */}
                </div>
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-36 h-28 object-cover rounded-lg"
                  />
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Blog Section */}
      <section className="bg-gray-100 py-12 px-4 max-w-6xl mx-auto">
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

export default ViralNews;
