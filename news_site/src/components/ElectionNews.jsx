import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { blogPublicService } from '../blogPublicService';
import { ArrowRight } from 'lucide-react';

const ElectionNews = () => {
  const [articles, setArticles] = useState([]);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contentRes = await blogPublicService.getPublishedContentOnPages('ElectionNews');
        setArticles(contentRes.contents || []);

        const blogRes = await blogPublicService.getPublishedBlogOnPages('ElectionNews');
        setPosts(blogRes.blogs || []);
      } catch (err) {
        console.error('Failed to load news', err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {/* SECTION: Election Articles */}
      <section className="bg-gradient-to-b from-white to-gray-100 py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 text-orange-600">Election News</h2>

        {articles.length === 0 ? (
          <p className="text-center text-gray-500">No election news available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {articles.map((item, idx) => (
              <Link
                to={`/election-news/${item.slug || item._id}`}
                key={idx}
                className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="sm:w-48 h-40 object-cover rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none"
                    />
                  )}
                  <div className="p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition">
                        {item.title}
                      </h3>
                      <p className="text-sm text-red-500 mt-1">{item.category}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm text-blue-600 mt-3 group-hover:underline">
                      Read more <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* SECTION: Blogs */}
      <section className="bg-white py-12 px-4 max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-gray-800">📝 Related Blogs</h2>
          <p className="text-sm text-gray-500 mt-2">Insights, opinions, and election breakdowns</p>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No blog posts found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-gray-50 border rounded-xl shadow hover:shadow-md transition flex flex-col overflow-hidden"
              >
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{post.title}</h3>
                  <p className="text-sm text-gray-600 flex-1">{post.summary}</p>
                  <div className="mt-4 text-xs text-gray-500">
                    By <span className="text-black font-medium">{post.author}</span> •{' '}
                    {post.publishDate
                      ? new Date(post.publishDate).toLocaleDateString()
                      : 'Unknown Date'}
                  </div>
                  <button
                    onClick={() => navigate(`/blog/${post._id}`)}
                    className="mt-4 inline-flex items-center gap-2 text-orange-600 hover:underline font-medium self-start"
                  >
                    Read Full Blog <ArrowRight size={16} />
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

export default ElectionNews;
