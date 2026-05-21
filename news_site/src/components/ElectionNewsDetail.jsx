import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogPublicService } from '../blogPublicService';
import { useAuthor } from '../hooks/useAuthor';
import { ArrowLeft, Share2, Facebook, Twitter, Copy, Clock } from 'lucide-react';

export default function ElectionNewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const { author: authorProfile } = useAuthor(story?.author);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    blogPublicService
      .getPublishedContentOnPagesById('ElectionNews', id)
      .then((res) => setStory(res))
      .catch((err) => console.error('Error loading election news:', err));
  }, [id]);

  const currentUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleAuthorClick = () => {
    const authorName = story?.author || 'Staff Reporter';
    window.open(`/author/${encodeURIComponent(authorName)}`, '_blank');
  };

  if (!story) return <p className="p-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-sm text-gray-600 hover:text-black"
      >
        <ArrowLeft size={18} className="mr-1" />
        Back
      </button>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-4 text-gray-900">{story.title}</h1>
      
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
          {story.category || 'Election News'}
        </span>
      </div>

      {/* Share Buttons */}
      <div className="flex gap-3 mb-6 items-center">
        <span className="text-sm text-gray-600 font-medium">Share:</span>
        <button onClick={handleCopyLink} className="text-gray-600 hover:text-black">
          <Copy size={18} />
        </button>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800"
        >
          <Facebook size={18} />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(
            story.title
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-600"
        >
          <Twitter size={18} />
        </a>
        {copied && <span className="text-green-600 text-xs ml-2">Link copied!</span>}
      </div>

      {/* Image */}
      {story.imageUrl && (
        <img
          src={story.imageUrl}
          alt={story.title}
          className="w-full rounded-xl shadow-md mb-6 object-cover"
        />
      )}

      {/* Content */}
      <div
        className="prose max-w-none prose-lg prose-img:rounded-md prose-p:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: story.content }}
      />
    </div>
  );
}
