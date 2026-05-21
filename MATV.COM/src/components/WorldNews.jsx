import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { blogPublicService } from '../blogPublicService';
import { useWorldNewsFallback } from '../store/worldNewsFallbackStore'; // ✅ import fallback store

export const WorldNews = () => {
  const [content, setContent] = useState({ worldNews: [] });
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  // ✅ Fallback store hook
  const { fetch: fetchFallback } = useWorldNewsFallback();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try backend API first
        const contentRes = await blogPublicService.getPublishedContentOnPages('WorldNews');
        setContent({ worldNews: contentRes.contents || [] });

        const blogRes = await blogPublicService.getPublishedBlogOnPages('WorldNews');
        setPosts(blogRes.blogs || []);
      } catch (err) {
        console.error('❌ Error fetching WorldNews data from backend:', err);

        // ✅ Fallback to News API store if backend fails
        try {
          console.log('🌍 Switching to fallback World News API...');
          const { worldNews, blogs, error } = await fetchFallback();

          if (error) console.error('Fallback API error:', error);
          setContent({ worldNews });
          setPosts(blogs || []);
        } catch (fallbackErr) {
          console.error('❌ Fallback also failed:', fallbackErr);
        }
      }
    };

    fetchData();
  }, []);

  // Extract main story and others
  const mainStory =
    Array.isArray(content.worldNews) && content.worldNews.length > 0
      ? content.worldNews[0]
      : null;

  const otherStories =
    Array.isArray(content.worldNews) && content.worldNews.length > 1
      ? content.worldNews.slice(1)
      : [];

  return (
    <>
      {/* World News Section */}
      <section className="bg-white py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          World News
        </h2>

        {mainStory && (
          <Link
            to={`/world/${mainStory.slug || mainStory._id}`}
            className="block rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition mb-10"
          >
            <img
              src={mainStory.imageUrl}
              alt={mainStory.title}
              className="w-full h-80 object-cover"
            />
            <div className="p-6 bg-white">
              <p className="text-sm text-red-500 font-medium mb-2">
                {mainStory.category}
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {mainStory.title}
              </h3>
            </div>
          </Link>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {otherStories.map((story, index) => (
            <Link
              to={`/world/${story.slug || story._id}`}
              key={index}
              className="flex items-center bg-gray-50 hover:bg-gray-100 rounded-lg shadow transition p-4 gap-4"
            >
              <img
                src={story.imageUrl}
                alt={story.title}
                className="h-20 w-32 object-cover rounded"
              />
              <div>
                <p className="text-xs text-red-500 font-semibold mb-1">
                  {story.category}
                </p>
                <h4 className="text-lg font-semibold text-gray-800">
                  {story.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Blog Section */}
      <section className="bg-gray-50 py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          📝 Latest Blog Posts
        </h2>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No blog posts found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition flex flex-col"
              >
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-xl text-gray-800 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 flex-1 line-clamp-3">
                    {post.summary}
                  </p>
                  <div className="mt-4 text-xs text-gray-500">
                    By <span className="font-medium">{post.author}</span> •{' '}
                    {post.publishDate
                      ? new Date(post.publishDate).toLocaleDateString()
                      : 'Unknown Date'}
                  </div>
                  <button
                    onClick={() => navigate(`/blog/${post._id}`)}
                    className="mt-4 inline-block text-orange-600 hover:text-orange-700 font-semibold transition"
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

export default WorldNews;
