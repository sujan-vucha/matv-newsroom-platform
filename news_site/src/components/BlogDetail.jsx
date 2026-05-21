import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { blogPublicService } from '../blogPublicService';






const API = import.meta.env.VITE_API_BASE_URL;





const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

useEffect(() => {
  blogPublicService.getPublishedBlogById(id)
    .then(setPost)
    .catch(err => console.error('Error loading blog:', err));
}, [id]);


  if (!post) return <p className="p-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        By {post.author} • {post.date}
      </p>
      {post.imageUrl ?(
        <img src={post.imageUrl} alt={post.title} className="w-full rounded shadow mb-6" />
      ):<p>cant fetch img</p>}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
};

export default BlogDetail;
