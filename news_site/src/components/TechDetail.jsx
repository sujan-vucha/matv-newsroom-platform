import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogPublicService } from '../blogPublicService';
import { useAuthor } from '../hooks/useAuthor';
import {
  Facebook,
  Twitter,
  Linkedin,
  ArrowLeft,
  Copy,
  Clock
} from 'lucide-react';

export default function TechDetail() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const { author: authorProfile } = useAuthor(story?.author);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    blogPublicService
      .getPublishedContentOnPagesById('Tech', id)
      .then((res) => setStory(res))
      .catch((err) => console.error('Error loading tech article:', err));
  }, [id]);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAuthorClick = () => {
    const authorName = story?.author || 'Staff Reporter';
    window.open(`/author/${encodeURIComponent(authorName)}`, '_blank');
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(
      story?.title || 'Check this out!'
    )}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(story?.title + ' - ' + currentUrl)}`
  };

  if (!story) return <p className="p-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline flex items-center text-sm"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
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
          {story.category || 'Tech'}
        </span>
      </div>

      {/* Share Buttons */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm font-medium text-gray-600">Share:</span>

        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1877F2] hover:opacity-80"
        >
          <Facebook className="text-white w-4 h-4" />
        </a>
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1DA1F2] hover:opacity-80"
        >
          <Twitter className="text-white w-4 h-4" />
        </a>
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0077B5] hover:opacity-80"
        >
          <Linkedin className="text-white w-4 h-4" />
        </a>
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#25D366] hover:opacity-80"
        >
          <svg
            className="w-4 h-4 fill-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
          >
            <path d="M16.04 2.003c-7.39 0-13.4 5.966-13.4 13.318 0 2.348.61 4.636 1.767 6.656L2.003 30l8.263-2.3a13.338 13.338 0 005.777 1.37h.005c7.387 0 13.397-5.965 13.397-13.316.002-7.35-6.01-13.317-13.401-13.317zm.02 24.41c-1.844 0-3.655-.497-5.236-1.44l-.375-.222-4.905 1.366 1.31-4.79-.244-.392a10.618 10.618 0 01-1.575-5.568c0-5.857 4.788-10.625 10.672-10.625 5.885 0 10.676 4.768 10.676 10.624 0 5.857-4.79 10.624-10.676 10.624zm6.029-7.971c-.33-.165-1.95-.962-2.253-1.07-.302-.112-.523-.165-.744.165-.223.33-.854 1.07-1.048 1.29-.195.22-.387.248-.717.082-.33-.165-1.392-.513-2.65-1.636-.981-.873-1.642-1.957-1.832-2.287-.195-.33-.022-.508.15-.672.154-.153.33-.387.495-.582.165-.194.223-.33.33-.55.11-.22.056-.413-.027-.58-.084-.165-.744-1.79-1.02-2.45-.27-.648-.548-.56-.744-.57a9.063 9.063 0 00-.635-.011c-.22 0-.58.082-.884.387-.3.33-1.158 1.13-1.158 2.757s1.186 3.198 1.35 3.42c.165.22 2.34 3.582 5.67 5.022.793.34 1.41.54 1.892.69.796.253 1.52.217 2.09.132.638-.095 1.95-.797 2.227-1.566.275-.77.275-1.43.193-1.566-.082-.136-.3-.22-.63-.385z" />
          </svg>
        </a>

        {/* Copy Link Button */}
        <button
          onClick={copyToClipboard}
          className="border border-gray-300 px-3 py-1.5 rounded flex items-center text-sm text-gray-700 hover:bg-gray-100"
        >
          <Copy className="w-4 h-4 mr-1" />
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>

      {/* Image */}
      {story.imageUrl && (
        <img
          src={story.imageUrl}
          alt={story.title}
          className="w-full rounded-xl shadow mb-6 object-cover"
        />
      )}

      {/* Content */}
      <div className="prose max-w-none prose-lg" dangerouslySetInnerHTML={{ __html: story.content }} />
    </div>
  );
}
