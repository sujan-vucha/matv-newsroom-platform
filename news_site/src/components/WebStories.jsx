import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogPublicService } from '../blogPublicService';
import { useNavigate } from 'react-router-dom';


const WebStories = () => {
  const [stories, setStories] = useState([]);
  const [posts, setPosts] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
              const fetchData = async () => {
                try {
                  const contentRes = await blogPublicService.getPublishedContentOnPages('WebStories');
                  setStories(contentRes.contents || []);

                  const blogRes = await blogPublicService.getPublishedBlogOnPages('WebStories');
                  setPosts(blogRes.blogs || []);
                } catch (err) {
                  console.error('Failed to load news', err);
                }
              };
          
              fetchData();
            }, []);

  return (
    <>
    <section className="bg-gray-100 py-10 px-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Latest Web Stories</h2>

      {stories.length === 0 ? (
        <p className="text-center text-gray-500">No web stories available at the moment.</p>
      ) : (
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
          {stories.map((item, idx) => (
            <Link
              to={`/web-stories/${item.slug || item._id}`}
              key={idx}
              className="flex-none w-48 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-32 w-full object-cover rounded-t-lg"
              />
              <div className="p-2">
                <h4 className="text-sm font-semibold leading-snug line-clamp-2">{item.title}</h4>
                <p className="text-xs text-red-600 mt-1">{item.category}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>

    <section className="bg-gray-100 py-8 px-4 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Blog</h2>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No blog posts found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
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

export default WebStories;
