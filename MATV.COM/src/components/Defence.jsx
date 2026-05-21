import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { blogPublicService } from '../blogPublicService';

const Defence = () => {
  const [articles, setArticles] = useState([]);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contentRes = await blogPublicService.getPublishedContentOnPages('Defence');
        setArticles(contentRes.contents || []);

        const blogRes = await blogPublicService.getPublishedBlogOnPages('Defence');
        setPosts(blogRes.blogs || []);
      } catch (err) {
        console.error('Failed to load defence content:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 py-10 px-4 lg:px-0">
      <div className="max-w-6xl mx-auto">
        {/* Section: Defence Articles */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-6 border-b pb-2 border-gray-300">
            🛡️ Defence Articles
          </h2>

          {articles.length === 0 ? (
            <p className="text-center text-gray-500">No defence articles available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((item, idx) => (
                <Link
                  to={`/defence/${item.slug || item._id}`}
                  key={idx}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-200 overflow-hidden flex flex-col md:flex-row gap-4"
                >
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full md:w-48 h-40 object-cover"
                    />
                  )}
                  <div className="p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-xl text-gray-800">{item.title}</h3>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-3">{item.summary}</p>
                    </div>
                    <span className="inline-block mt-3 text-xs font-medium bg-red-100 text-red-700 px-3 py-1 rounded-full w-fit">
                      {item.category}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Section: Blogs */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-6 border-b pb-2 border-gray-300">
            ✍️ Defence Blogs
          </h2>

          {posts.length === 0 ? (
            <p className="text-center text-gray-500">No blog posts found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
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
                    <p className="text-sm text-gray-600 flex-1">{post.summary}</p>
                    <div className="mt-4 text-xs text-gray-500">
                      By {post.author || 'Anonymous'} •{' '}
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
      </div>
    </div>
  );
};

export default Defence;
