import React, { useEffect } from 'react';
import { X, Clock } from 'lucide-react';
import DOMPurify from 'dompurify';
import { useAuthor } from '../hooks/useAuthor';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
} from 'react-share';

/**
 * Map category -> route segment for your site
 */
const CATEGORY_ROUTES = {
  entertainment: 'entertainment',
  world: 'world',
  'latest news': 'latest-news',
  sports: 'sports',
  national: 'india-news', // API "National" == /india-news
  india: 'india-news',
  'viral news': 'viral',
  technology: 'technology',
};

/**
 * Base domain to use in all shares:
 * - Prefer VITE_SHARE_BASE_URL (e.g., https://matvchannel.com)
 * - Otherwise fallback to current origin
 */
const BASE_DOMAIN = (
  import.meta.env?.VITE_SHARE_BASE_URL ||
  (typeof window !== 'undefined' ? window.location.origin : '')
).replace(/\/+$/, '');

/** Turn a title into a slug */
function toSlug(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Always build a local, section-aware link on YOUR domain
 * ignoring any external absolute_url from the API.
 */
function buildShareUrl(article) {
  const id = article?._id || article?.id || '';
  const titleSlug = article?.title ? toSlug(article.title) : '';
  const slug = article?.slug || (titleSlug && id ? `${titleSlug}-${id}` : (titleSlug || id || 'story'));

  const rawCategory = article?.category || article?.category_name || '';
  const categoryKey = rawCategory.toLowerCase().trim();

  const route =
    CATEGORY_ROUTES[categoryKey] ||
    // loosen matching (e.g., "Entertainment • TV")
    Object.keys(CATEGORY_ROUTES).find((k) => categoryKey.includes(k)) ||
    'news'; // ultimate fallback

  return `${BASE_DOMAIN}/${route}/${slug}`;
}

export default function ArticleModal({ article, isOpen, onClose }) {
  const { author: authorProfile } = useAuthor(article?.author);

  // Build share values (always your domain)
  const shareUrl = buildShareUrl(article);
  const shareTitle = article?.title || 'Story';
  const shareSummary =
    article?.summary ||
    (typeof article?.content === 'string'
      ? article.content.replace(/<[^>]*>/g, '').slice(0, 160)
      : '');

  // Update meta tags for social sharing when modal opens
  useEffect(() => {
    if (!isOpen || !article) return;

    const updateMetaTag = (property, content) => {
      let el =
        document.querySelector(`meta[property="${property}"]`) ||
        document.querySelector(`meta[name="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(property.startsWith('og:') ? 'property' : 'name', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const imageUrl = article?.img || article?.imageUrl || '/logo.jpg';

    document.title = shareTitle;
    updateMetaTag('og:title', shareTitle);
    updateMetaTag('og:description', shareSummary);
    updateMetaTag('og:image', imageUrl);
    updateMetaTag('og:url', shareUrl);
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', shareTitle);
    updateMetaTag('twitter:description', shareSummary);
    updateMetaTag('twitter:image', imageUrl);
  }, [isOpen, article, shareTitle, shareSummary, shareUrl]);

  if (!isOpen || !article) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('🔗 Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('❌ Failed to copy link');
    }
  };

  const handleAuthorClick = () => {
    const authorName = article?.author || 'Staff Reporter';
    window.open(`/author/${encodeURIComponent(authorName)}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header image */}
        <div className="relative">
          <div
            className="h-64 bg-cover bg-center relative"
            style={{
              backgroundImage: `url('${article?.img || article?.imageUrl || '/fallback.jpg'}')`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-opacity-30 transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Category */}
            <div className="absolute top-4 left-4">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {article?.category || article?.category_name || article?.tags?.[0] || 'News'}
              </span>
            </div>

            {/* Live badge */}
            {article?.isLive && (
              <div className="absolute top-4 left-24">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  LIVE
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-16rem)]">
          <div className="p-8">
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {article?.title}
            </h1>

            {/* Meta + Share */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {/* Author */}
                <div className="flex items-center gap-2">
                  {authorProfile?.avatar && (
                    <img
                      src={authorProfile.avatar}
                      alt={article?.author}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  )}
                  <button
                    onClick={handleAuthorClick}
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors cursor-pointer"
                  >
                    {article?.author || 'Staff Reporter'}
                  </button>
                  {authorProfile?.title && (
                    <span className="text-gray-400">• {authorProfile.title}</span>
                  )}
                </div>

                {/* Time */}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{article?.timeAgo}</span>
                </div>
              </div>

              {/* Share buttons */}
              <div className="flex items-center gap-2">
                <FacebookShareButton url={shareUrl} quote={shareTitle}>
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} title={shareTitle}>
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <WhatsappShareButton url={shareUrl} title={shareTitle}>
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
                <LinkedinShareButton url={shareUrl} title={shareTitle} summary={shareSummary}>
                  <LinkedinIcon size={32} round />
                </LinkedinShareButton>

                <button
                  onClick={handleCopyLink}
                  className="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
                  title="Copy link"
                >
                  Copy Link
                </button>
              </div>
            </div>

            {/* Summary */}
            {article?.summary && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
                <p className="text-gray-700 leading-relaxed">{article.summary}</p>
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div
                className="text-gray-700 leading-relaxed mb-4"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(article?.content || ''),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
