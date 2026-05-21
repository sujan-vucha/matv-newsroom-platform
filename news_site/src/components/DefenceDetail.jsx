import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogPublicService } from '../blogPublicService';
import { useAuthor } from '../hooks/useAuthor';
import { ArrowLeft, Copy, Clock } from 'lucide-react';

export default function DefenceDetail() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const { author: authorProfile } = useAuthor(story?.author);
  const navigate = useNavigate();



  
  
  useEffect(() => {
    blogPublicService
      .getPublishedContentOnPagesById('Defence', id)
      .then((res) => setStory(res))
      .catch((err) => console.error('Error loading defence article:', err));
  }, [id]);

  const currentUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    alert('🔗 Link copied to clipboard!');
  };

  const handleAuthorClick = () => {
    const authorName = story?.author || 'Staff Reporter';
    window.open(`/author/${encodeURIComponent(authorName)}`, '_blank');
  };

  if (!story) return <p className="p-10 text-center">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Back Button */}
      <div className="flex justify-start items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-black"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>

      {/* Article Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{story.title}</h1>
      
      {/* Author and Meta Info */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {authorProfile?.avatar && (
            <img 
              src={authorProfile.avatar} 
              alt={story.author}
              className="w-6 h-6 rounded-full object-cover"
            />
          )}
          <button
            onClick={handleAuthorClick}
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors cursor-pointer"
          >
            {story.author || 'Staff Reporter'}
          </button>
          {authorProfile?.title && (
            <span className="text-gray-400">• {authorProfile.title}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{story.publishDate ? new Date(story.publishDate).toLocaleDateString() : 'Recently'}</span>
        </div>
        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">
          {story.category || 'Defence'}
        </span>
      </div>

      {/* Share Buttons Inline */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-gray-600 font-medium">Share:</span>

        <a
          href={`https://wa.me/?text=${encodeURIComponent(story.title + ' ' + currentUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on WhatsApp"
        >
          <img src="https://cdn-icons-png.flaticon.com/24/733/733585.png" alt="WhatsApp" />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(story.title)}&url=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on Twitter"
        >
          <img src="https://cdn-icons-png.flaticon.com/24/733/733579.png" alt="Twitter" />
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on Facebook"
        >
          <img src="https://cdn-icons-png.flaticon.com/24/733/733547.png" alt="Facebook" />
        </a>
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(story.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on LinkedIn"
        >
          <img src="https://cdn-icons-png.flaticon.com/24/733/733561.png" alt="LinkedIn" />
        </a>
        <button
          onClick={handleCopy}
          title="Copy Link"
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <Copy size={18} />
        </button>
      </div>

      {/* Article Image */}
      {story.imageUrl && (
        <img
          src={story.imageUrl}
          alt={story.title}
          className="w-full rounded-lg shadow-md mb-6"
        />
      )}

      {/* Article Content */}
      <div
        className="prose max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: story.content }}
      />
    </div>
  );
}
