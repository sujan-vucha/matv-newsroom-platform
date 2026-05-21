import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogPublicService } from '../blogPublicService';
import { useAuthor } from '../hooks/useAuthor';
import { useSportfitFallback } from '../store/sportfitFallbackStore';

import { ArrowLeft, Copy, Clock } from 'lucide-react';
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

export default function SportfitDetail() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const { author: authorProfile } = useAuthor(story?.author);
  const navigate = useNavigate();
  const { fetch: fetchFallback, fetchOne: fetchFallbackOne } = useSportfitFallback();

  const url = typeof window !== 'undefined' ? window.location.href : '';
  const title = story?.title || 'SportFit Article';

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      // Backend first
      try {
        const res = await blogPublicService.getPublishedContentOnPagesById('SportFit', id);
        if (!cancelled && res) {
          setStory({
            id: res._id || res.id || id,
            title: res.title,
            author: res.author || 'Staff Reporter',
            publishDate: res.publishDate || res.publishedAt || res.published_at || res.created_at || null,
            category: res.sub_category_name || res.category || 'SportFit',
            imageUrl: res.imageUrl,
            content: res.content || res.body || ''
          });
          return;
        }
      } catch (err) {
        console.error('❌ Backend SportFit detail failed; using fallback…', err);
      }

      // Fallback
      try {
        await fetchFallback(24);
        const match = await fetchFallbackOne(id);
        if (!cancelled && match) {
          setStory({
            id: match._id || match.id || id,
            title: match.title,
            author: match.author || 'Staff Reporter',
            publishDate: match.publishDate || match.publishedAt || match.published_at || match.created_at || null,
            category: match.sub_category_name || match.category || 'SportFit',
            imageUrl: match.imageUrl,
            content: match.content || ''
          });
        }
      } catch (fbErr) {
        console.error('❌ Fallback SportFit detail failed:', fbErr);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [id, fetchFallback, fetchFallbackOne]);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const handleAuthorClick = () => {
    const authorName = story?.author || 'Staff Reporter';
    window.open(`/author/${encodeURIComponent(authorName)}`, '_blank');
  };

  if (!story) return <p className="p-10">Loading...</p>;

  const timeAgo = formatTimeAgo(story.publishDate);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-black"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>

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
          {timeAgo && <span className="text-gray-400">• {timeAgo}</span>}
        </div>
        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">
          {story.category || 'SportFit'}
        </span>
      </div>

      {/* Share Buttons */}
      <div className="flex flex-wrap gap-3 items-center mb-6">
        <span className="text-gray-700 font-medium">Share:</span>
        <FacebookShareButton url={url} quote={title}>
          <FacebookIcon size={36} round />
        </FacebookShareButton>
        <TwitterShareButton url={url} title={title}>
          <TwitterIcon size={36} round />
        </TwitterShareButton>
        <LinkedinShareButton url={url} title={title}>
          <LinkedinIcon size={36} round />
        </LinkedinShareButton>
        <WhatsappShareButton url={url} title={title}>
          <WhatsappIcon size={36} round />
        </WhatsappShareButton>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100"
        >
          <Copy size={16} />
          Copy Link
        </button>
      </div>

      {/* Image */}
      {story.imageUrl && (
        <img
          src={story.imageUrl}
          alt={story.title}
          className="w-full rounded-lg shadow-md mb-6"
        />
      )}

      {/* Content */}
      <div
        className="prose max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: story.content || '' }}
      />
    </div>
  );
}
