import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { blogPublicService } from '../blogPublicService';

const Education = () => {
  const [articles, setArticles] = useState([]);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contentRes = await blogPublicService.getPublishedContentOnPages('Education');
        setArticles(contentRes.contents || []);

        const blogRes = await blogPublicService.getPublishedBlogOnPages('Education');
        setPosts(blogRes.blogs || []);
      } catch (err) {
        console.error('Failed to load news', err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* Articles Section */}
      <section className="bg-gray-100 py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">Education</h2>

        {articles.length === 0 ? (
          <p className="text-center text-gray-500">No education articles available.</p>
        ) : (
          <div className="space-y-6">
            {articles.map((item, idx) => (
              <Link
                to={`/education/${item.slug || item._id}`}
                key={idx}
                className="flex items-start gap-6 bg-white p-5 rounded-lg shadow hover:shadow-md hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex-grow">
                  <h4 className="text-xl font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-sm text-red-600 mt-2">{item.category}</p>
                </div>
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-40 h-28 object-cover rounded-md shadow-sm"
                  />
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Blog Section */}
      <section className="bg-white py-12 px-4 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800">From the Blog</h2>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No blog posts found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-gray-50 rounded-lg shadow hover:shadow-lg transition-all duration-200 flex flex-col"
              >
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{post.title}</h3>
                  <p className="text-sm text-gray-600 flex-grow">{post.summary}</p>
                  <div className="mt-3 text-xs text-gray-500">
                    By {post.author} •{' '}
                    {post.publishDate
                      ? new Date(post.publishDate).toLocaleDateString()
                      : 'Unknown Date'}
                  </div>
                  <button
                    onClick={() => navigate(`/blog/${post._id}`)}
                    className="mt-4 text-orange-600 hover:text-orange-700 font-semibold"
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

export default Education;
