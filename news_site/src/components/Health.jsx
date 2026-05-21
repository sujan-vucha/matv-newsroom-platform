import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { blogPublicService } from '../blogPublicService';

const Health = () => {
  const [articles, setArticles] = useState([]);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contentRes = await blogPublicService.getPublishedContentOnPages('Health');
        setArticles(contentRes.contents || []);

        const blogRes = await blogPublicService.getPublishedBlogOnPages('Health');
        setPosts(blogRes.blogs || []);
      } catch (err) {
        console.error('Failed to load news', err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* News Section */}
      <section className="bg-white py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">Health News</h2>

        {articles.length === 0 ? (
          <p className="text-center text-gray-500">No health articles available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map((item, idx) => (
              <Link
                to={`/health/${item.slug || item._id}`}
                key={idx}
                className="bg-gray-50 hover:bg-white border rounded-xl shadow hover:shadow-lg transition p-5 flex gap-4 items-start"
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-36 h-28 object-cover rounded-lg border"
                  />
                )}
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800 leading-snug">{item.title}</h4>
                    <p className="text-xs text-red-600 mt-2">{item.category}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Read more →</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Blog Section */}
      <section className="bg-gray-100 py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Health Blog</h2>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No blog posts found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
              >
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-sm text-gray-600 flex-grow">{post.summary}</p>
                  <div className="mt-4 text-xs text-gray-500">
                    By {post.author} •{' '}
                    {post.publishDate
                      ? new Date(post.publishDate).toLocaleDateString()
                      : 'Unknown Date'}
                  </div>
                  <button
                    onClick={() => navigate(`/blog/${post._id}`)}
                    className="mt-3 text-orange-600 hover:text-orange-700 font-semibold self-start"
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

export default Health;
