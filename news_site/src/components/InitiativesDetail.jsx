import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogPublicService } from '../blogPublicService';
import { useAuthor } from '../hooks/useAuthor';
import { ArrowLeft, Facebook, Twitter, Linkedin, Copy, Clock } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

export default function InitiativesDetail() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const { author: authorProfile } = useAuthor(story?.author);
  const navigate = useNavigate();

  useEffect(() => {
    blogPublicService
      .getPublishedContentOnPagesById('Initiatives', id)
      .then((res) => setStory(res))
      .catch((err) => console.error('Error loading initiative:', err));
  }, [id]);

  const currentUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    alert('Link copied to clipboard!');
  };

  const handleAuthorClick = () => {
    const authorName = story?.author || 'Staff Reporter';
    window.open(`/author/${encodeURIComponent(authorName)}`, '_blank');
  };

  if (!story) return <p className="p-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-gray-600 hover:text-black mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </button>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-4">{story.title}</h1>
      
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
          {story.category || 'Initiatives'}
        </span>
      </div>

      {/* Share Buttons */}
      <div className="flex items-center gap-3 mb-6">
        <span className="font-semibold text-sm">Share:</span>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Facebook className="text-blue-600 hover:scale-110 transition" />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${currentUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Twitter className="text-sky-500 hover:scale-110 transition" />
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin className="text-blue-700 hover:scale-110 transition" />
        </a>
        <a
          href={`https://wa.me/?text=${currentUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp className="text-green-500 hover:scale-110 transition text-[20px]" />
        </a>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 border border-gray-300 px-2 py-1 text-sm rounded hover:bg-gray-100"
        >
          <Copy className="h-4 w-4" /> Copy Link
        </button>
      </div>

      {/* Image */}
      <img
        src={story.imageUrl}
        alt={story.title}
        className="w-full rounded shadow mb-6"
      />

      {/* Content */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: story.content }}
      />
    </div>
  );
}
