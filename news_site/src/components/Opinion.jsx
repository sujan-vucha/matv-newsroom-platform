import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { blogPublicService } from '../blogPublicService';

const Opinion = () => {
  const [articles, setArticles] = useState([]);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contentRes = await blogPublicService.getPublishedContentOnPages('Opinion');
        setArticles(contentRes.contents || []);

        const blogRes = await blogPublicService.getPublishedBlogOnPages('Opinion');
        setPosts(blogRes.blogs || []);
      } catch (err) {
        console.error('Failed to load opinion content:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* Opinion Section */}
      <section className="bg-white py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Opinion</h2>

        {articles.length === 0 ? (
          <p className="text-center text-gray-500">No opinion articles available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((item, idx) => (
              <Link
                to={`/opinion/${item.slug || item._id}`}
                key={idx}
                className="flex gap-4 bg-gray-50 hover:bg-white rounded-xl shadow-sm hover:shadow-md p-4 transition-all duration-300"
              >
                <div className="flex flex-col justify-between flex-grow">
                  <h4 className="text-lg font-semibold text-gray-800">{item.title}</h4>
                  <span className="inline-block text-xs mt-2 bg-red-100 text-red-600 px-2 py-1 rounded-full w-fit">
                    {item.category}
                  </span>
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
      <section className="bg-gray-50 py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">📝 Related Blogs</h2>

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

export default Opinion;
