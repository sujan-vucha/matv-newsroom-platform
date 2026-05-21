import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Eye, Share2, ArrowLeft } from 'lucide-react';
import { useAuthor } from '../hooks/useAuthor';

const ArticleDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { author: authorProfile } = useAuthor(article?.author);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  useEffect(() => {
    if (article) {
      // Generate proper slug URL using ObjectId
      const properSlug = generateSlug(article.title, article._id);
      const newUrl = `/articles/${properSlug}`;
      
      // Update browser URL without page reload
      if (window.location.pathname !== newUrl) {
        window.history.replaceState(null, '', newUrl);
      }
      
      // Update meta tags for social sharing
      document.title = article.title;
      
      // Update or create meta tags
      const updateMetaTag = (property, content) => {
        let meta = document.querySelector(`meta[property="${property}"]`) || 
                  document.querySelector(`meta[name="${property}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute(property.startsWith('og:') ? 'property' : 'name', property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };
      
      const fullUrl = `${window.location.origin}${newUrl}`;
      updateMetaTag('og:title', article.title);
      updateMetaTag('og:description', article.metaDescription || article.description || '');
      updateMetaTag('og:image', article.imageUrl || '/logo.jpg');
      updateMetaTag('og:url', fullUrl);
      updateMetaTag('twitter:card', 'summary_large_image');
      updateMetaTag('twitter:title', article.title);
      updateMetaTag('twitter:description', article.metaDescription || article.description || '');
      updateMetaTag('twitter:image', article.imageUrl || '/logo.jpg');
    }
  }, [article]);

  useEffect(() => {
    if (article && article.pages && article.pages.length > 0) {
      fetchRelatedArticles(article.pages[0]);
    }
  }, [article]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      
      if (!slug) {
        setError('No article slug provided');
        setLoading(false);
        return;
      }
      
      // Extract MongoDB ObjectId from slug (24 hex characters)
      const objectIdMatch = slug.match(/[0-9a-fA-F]{24}/);
      
      if (!objectIdMatch) {
        setError('Invalid article ID - no ObjectId found');
        setLoading(false);
        return;
      }
      
      const articleId = objectIdMatch[0];
      const url = `${import.meta.env.VITE_BACKEND_API_BASE_URL}/home-contents/published/${articleId}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setArticle(data.data);
      } else {
        setError('Article not found');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async (section) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_BASE_URL}/home-contents/published/pages/${section}?limit=6`);
      const data = await response.json();
      
      if (data.success) {
        // Filter out current article and take only 5
        const filtered = data.data.filter(item => generateSlug(item.title, item._id) !== slug).slice(0, 5);
        setRelatedArticles(filtered);
      }
    } catch (err) {
      console.error('Failed to fetch related articles:', err);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.metaDescription || article.description,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  // Generate SEO-friendly URL slug with ObjectId
  const generateSlug = (title, objectId) => {
    const titleSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
    return `${titleSlug}-${objectId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>

        {/* Article Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {article.imageUrl && (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          )}
          
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            
            {(article.metaDescription || article.description) && (
              <p className="text-lg text-gray-600 mb-6">
                {article.metaDescription || article.description}
              </p>
            )}

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center">
                {authorProfile?.avatar && (
                  <img 
                    src={authorProfile.avatar} 
                    alt={article.author}
                    className="w-6 h-6 rounded-full mr-2 object-cover"
                  />
                )}
                <button
                  onClick={() => navigate(`/author/${encodeURIComponent(article.author)}`)}
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors cursor-pointer"
                >
                  {article.author}
                </button>
                {authorProfile?.title && (
                  <span className="ml-2 text-gray-400">• {authorProfile.title}</span>
                )}
              </div>
              
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span>{new Date(article.publishedAt || article.publishDate).toLocaleDateString()}</span>
              </div>
              
              {article.views && (
                <div className="flex items-center">
                  <Eye size={16} className="mr-1" />
                  <span>{article.views} views</span>
                </div>
              )}
              
              <button
                onClick={handleShare}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Share2 size={16} className="mr-1" />
                Share
              </button>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <div
                  key={relatedArticle._id}
                  onClick={() => navigate(`/articles/${generateSlug(relatedArticle.title, relatedArticle._id)}`)}
                  className="cursor-pointer group hover:shadow-md transition-shadow rounded-lg overflow-hidden border border-gray-200"
                >
                  {relatedArticle.imageUrl && (
                    <img
                      src={relatedArticle.imageUrl}
                      alt={relatedArticle.title}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {relatedArticle.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{relatedArticle.author}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(relatedArticle.publishedAt || relatedArticle.publishDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;