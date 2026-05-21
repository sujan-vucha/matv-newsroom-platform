import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogPublicService } from '../blogPublicService';
import { useLatestNewsFallback } from '../store/latestNewsFallbackStore'; // ✅ fallback
import { useAuthor } from '../hooks/useAuthor';
import { Clock } from 'lucide-react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from 'react-share';

export default function LatestNewsDetail() {
  const { id } = useParams(); // id or slug
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const { fetchOne: fetchFallbackOne } = useLatestNewsFallback();
  const { author: authorProfile } = useAuthor(story?.author);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await blogPublicService.getPublishedContentOnPagesById('LatestNews', id);
        if (!cancelled && res) {
          setStory({
            id: res._id || res.id || id,
            title: res.title,
            author: res.author || 'Staff Reporter',
            publishDate: res.publishDate || res.publishedAt || null,
            category: res.category || 'Latest News',
            imageUrl: res.imageUrl,
            content: res.content || res.body || ''
          });
          return;
        }
      } catch (err) {
        console.error('❌ Backend latest detail failed, using fallback...', err);
      }

      try {
        const item = await fetchFallbackOne(id);
        if (!cancelled && item) setStory(item);
      } catch (fbErr) {
        console.error('❌ Fallback latest detail failed:', fbErr);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    alert('Link copied to clipboard!');
  };

  const handleAuthorClick = () => {
    const authorName = story?.author || 'Staff Reporter';
    window.open(`/author/${encodeURIComponent(authorName)}`, '_blank');
  };

  if (!story) return <p className="p-10 text-center text-gray-500">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-blue-600 hover:underline flex items-center gap-1"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-4 text-gray-800">{story.title}</h1>

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
          {story.category || 'Latest News'}
        </span>
      </div>

      {story.imageUrl && (
        <img
          src={story.imageUrl}
          alt={story.title}
          className="w-full rounded shadow mb-6"
        />
      )}
      <div
        className="prose prose-lg max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: story.content || '' }}
      />
    </div>
  );
}
