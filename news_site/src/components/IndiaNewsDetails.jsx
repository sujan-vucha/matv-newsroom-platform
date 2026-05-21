import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogPublicService } from '../blogPublicService';
import { useIndiaNewsFallback } from '../store/indiaNewsFallbackStore';
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
  WhatsappIcon
} from 'react-share';

// 🕒 “2 mins ago” / “3 hrs ago” / “1 day ago”
function formatTimeAgo(dateLike) {
  if (!dateLike) return '';
  const ts = new Date(dateLike).getTime();
  if (Number.isNaN(ts)) return '';
  const diffMs = Date.now() - ts;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export default function IndiaNewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const { fetch: fetchFallback, fetchOne: fetchFallbackOne } = useIndiaNewsFallback();
  const { author: authorProfile } = useAuthor(story?.author);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      // 1) Backend first
      try {
        const res = await blogPublicService.getPublishedContentOnPagesById('IndiaNews', id);
        if (!cancelled && res) {
          setStory({
            id: res._id || res.id || id,
            title: res.title,
            author: res.author || 'Staff Reporter',
            publishDate: res.publishDate || res.publishedAt || res.published_at || res.created_at || null,
            category: res.category_name || res.category || 'India News',
            imageUrl: res.imageUrl,
            content: res.content || res.body || ''
          });
          return;
        }
      } catch (err) {
        console.error('❌ Backend IndiaNews detail failed; using fallback…', err);
      }

      // 2) Fallback
      try {
        // Ensure fallback has items
        await fetchFallback(24);
        const match = await fetchFallbackOne(id);
        if (!cancelled && match) {
          setStory({
            id: match._id || match.id || id,
            title: match.title,
            author: match.author || 'Staff Reporter',
            publishDate: match.publishDate || match.publishedAt || match.published_at || match.created_at || null,
            category: match.category_name || match.category || 'India News',
            imageUrl: match.imageUrl,
            content: match.content || ''
          });
        }
      } catch (fbErr) {
        console.error('❌ Fallback IndiaNews detail failed:', fbErr);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [id, fetchFallback, fetchFallbackOne]);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    alert('Link copied to clipboard!');
  };

  const handleAuthorClick = () => {
    const authorName = story?.author || 'Staff Reporter';
    window.open(`/author/${encodeURIComponent(authorName)}`, '_blank');
  };

  if (!story) return <p className="p-10 text-center text-gray-500">Loading...</p>;

  const timeAgo = formatTimeAgo(story.publishDate);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-blue-600 hover:underline flex items-center gap-1"
      >
        ← Back
      </button>

      {/* Title */}
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
          {timeAgo && <span className="text-gray-400">• {timeAgo}</span>}
        </div>
        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">
          {story.category || 'India News'}
        </span>
      </div>

      {/* Share Buttons */}
      <div className="flex gap-3 items-center mb-6 flex-wrap">
        <FacebookShareButton url={currentUrl} quote={story.title}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton url={currentUrl} title={story.title}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <LinkedinShareButton url={currentUrl} title={story.title}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
        <WhatsappShareButton url={currentUrl} title={story.title}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
        <button
          onClick={handleCopy}
          className="text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
        >
          Copy Link
        </button>
      </div>

      {/* Image */}
      {story.imageUrl && (
        <img
          src={story.imageUrl}
          alt={story.title}
          className="w-full rounded shadow mb-6"
        />
      )}

      {/* Content */}
      <div
        className="prose prose-lg max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: story.content || '' }}
      />
    </div>
  );
}
