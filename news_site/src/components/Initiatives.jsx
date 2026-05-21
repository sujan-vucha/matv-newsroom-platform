import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { blogPublicService } from '../blogPublicService';

const Initiatives = () => {
  const [news, setNews] = useState([]);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contentRes = await blogPublicService.getPublishedContentOnPages('Initiatives');
        setNews(contentRes.contents || []);

        const blogRes = await blogPublicService.getPublishedBlogOnPages('Initiatives');
        setPosts(blogRes.blogs || []);
      } catch (err) {
        console.error('Failed to load content:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Initiatives Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Our Initiatives</h2>
          {news.length === 0 ? (
            <p className="text-center text-gray-500">No initiatives available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {news.map((item, idx) => (
                <Link
                  to={`/initiatives/${item.slug || item._id}`}
                  key={idx}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
                >
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold text-xl text-gray-800 mb-1">{item.title}</h4>
                    <p className="text-sm text-red-600">{item.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Blog Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">From the Blog</h2>
          </div>

          {posts.length === 0 ? (
            <p className="text-center text-gray-500">No blog posts found.</p>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex gap-6 pb-4">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="min-w-[300px] bg-white rounded-lg shadow-md hover:shadow-xl transition flex-shrink-0"
                  >
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-40 object-cover rounded-t"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-800 mb-1">{post.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-3">{post.summary}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        By {post.author} •{' '}
                        {post.publishDate
                          ? new Date(post.publishDate).toLocaleDateString()
                          : 'Unknown Date'}
                      </div>
                      <button
                        onClick={() => navigate(`/blog/${post._id}`)}
                        className="mt-3 text-orange-600 hover:text-orange-700 font-semibold text-sm"
                      >
                        Read More →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Initiatives;
