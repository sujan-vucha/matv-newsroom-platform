import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogPublicService } from '../blogPublicService';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    blogPublicService.getPublishedBlogs()
      .then((res) => setPosts(res.blogs))
      .catch(err => console.error('Failed to fetch blogs:', err));
  }, []);

  return (
    <section className="py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Blog</h2>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No blog posts found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(posts) ? posts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col">
              {post.imageUrl && (
                <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-gray-800 mb-2">{post.title}</h3>
                <p className="text-sm text-gray-600 flex-1">{post.summary}</p>
                <div className="mt-4 text-xs text-gray-500">
                  By {post.author} • {post.publishDate ? new Date(post.publishDate).toLocaleDateString() : 'Unknown Date'}
                </div>
                <button
                  onClick={() => navigate(`/blog/${post._id}`)}
                  className="mt-4 text-orange-600 hover:text-orange-700 font-semibold self-start"
                >
                  Read More →
                </button>
              </div>
            </div>
          )): console.error('Posts is not an array:', posts)}
        </div>
      )}
    </section>
  )
};

export default Blog;
