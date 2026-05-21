import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { blogPublicService } from '../blogPublicService';

const Tech = () => {
  const [articles, setArticles] = useState([]);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contentRes = await blogPublicService.getPublishedContentOnPages('Tech');
        setArticles(contentRes.contents || []);

        const blogRes = await blogPublicService.getPublishedBlogOnPages('Tech');
        setPosts(blogRes.blogs || []);
      } catch (err) {
        console.error('Failed to load news', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Articles Section */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Latest in Tech</h2>

        {articles.length === 0 ? (
          <p className="text-center text-gray-500">No tech articles available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((item, idx) => (
              <Link
                to={`/tech/${item.slug || item._id}`}
                key={idx}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300"
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-red-500 font-medium">{item.category}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Blog Section */}
      <section className="bg-white py-12 px-4 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Blog Posts</h2>

          {posts.length === 0 ? (
            <p className="text-center text-gray-500">No blog posts found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-gray-50 rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                >
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 flex-1">{post.summary}</p>
                    <div className="text-xs text-gray-500 mb-2">
                      By {post.author || 'Anonymous'} •{' '}
                      {post.publishDate
                        ? new Date(post.publishDate).toLocaleDateString()
                        : 'Unknown Date'}
                    </div>
                    <button
                      onClick={() => navigate(`/blog/${post._id}`)}
                      className="mt-auto text-blue-600 hover:underline font-medium text-sm"
                    >
                      Read More →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Tech;
