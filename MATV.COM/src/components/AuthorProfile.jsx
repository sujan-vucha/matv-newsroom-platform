import React from 'react';
import { ArrowLeft, Twitter, Linkedin, Bookmark, TrendingUp, Calendar, Archive } from 'lucide-react';
import { useAuthor } from '../hooks/useAuthor';
import { useState, useEffect } from 'react';

const AuthorProfile = ({ author, onBack }) => {

  const { author: authorData, loading, error, fetchAuthorArticles } = useAuthor(author?.name || author);
  const [activeTab, setActiveTab] = useState('latest');
  const [authorContent, setAuthorContent] = useState([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [page, setPage] = useState(1);
  
  // Fetch author's content when author data is loaded
  useEffect(() => {
    if (authorData?._id) {
      loadAuthorContent();
    }
  }, [authorData]);
  
  // Function to load author content
 const API_BASE_URL = import.meta.env.VITE_API_AUTHOR_BASE_URL;

const loadAuthorContent = async () => {
  if (!authorData?._id) return;

  setContentLoading(true);
  try {
    const response = await fetch(`${API_BASE_URL}/api/authors/${authorData._id}/content?page=${page}&limit=5`);
    const data = await response.json();

    if (data.title) authorData.title = data.title;
    if (data.category) authorData.category = data.category;

    if (data.content && data.content.length > 0) {
      setAuthorContent(prev => {
        const existingIds = new Set(prev.map(item => item._id));
        const newItems = data.content.filter(item => !existingIds.has(item._id));
        return [...prev, ...newItems];
      });
      setHasMoreContent(data.hasMore);
    } else {
      setHasMoreContent(false);
    }
  } catch (error) {
    console.error('Failed to load author content:', error);
  } finally {
    setContentLoading(false);
  }
};


  
  // Load more content
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
    loadAuthorContent();
  };
  
  // Track if we've loaded all content
  const [hasMoreContent, setHasMoreContent] = useState(true);

  if (!author) return null;

  // Get author name for placeholders
  const authorName = authorData?.name || (typeof author === 'object' ? author?.name : typeof author === 'string' ? author : 'Unknown Author');
  
  // Use API data if available, otherwise fall back to mock data with placeholders
  const displayAuthor = authorData ? {
    ...authorData,
    name: authorData.name || authorName,
    title: authorData.title || "MATV Staff",
    category: authorData.category || "BUSINESS",
    bio: authorData.bio || `${authorName} is a reporter on the MATV news team who covers major world news stories breaking overnight with a focus on technology and online platforms. He joined MATV in 2020 and works in New York.`,
    avatar: authorData.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1`,
    socialLinks: authorData.socialLinks || {
      twitter: "",
      linkedin: ""
    },
    articles: authorData.articles || []
  } : {
    name: authorName,
    avatar: author?.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1`,
    title: author?.title || "MATV Staff",
    category: author?.category || "BUSINESS",
    bio: author?.bio || `${authorName} is a reporter on the MATV news team who covers major world news stories breaking overnight with a focus on technology and online platforms. He joined MATV in 2020 and works in New York. He's covered ongoing Congressional efforts to force TikTok's Chinese parent to sell the social media platform, Elon Musk's handling of policy issues at X and the 2024 General Elections in India.`,
    email: author?.email || `${authorName.toLowerCase().replace(/\s+/g, '.')}@protonmail.com`,
    socialLinks: {
      twitter: author?.socialLinks?.twitter || "",
      linkedin: author?.socialLinks?.linkedin || ""
    },
    articles: author.articles || [
      {
        title: "Hackers Exploit Microsoft Software Vulnerability To Reportedly Target Governments And Businesses—What To Know",
        subtitle: "Microsoft released an emergency security patch on Sunday to 'mitigate active attacks targeting on-premises servers.'",
        trending: true,
        views: "19,216 views",
        timeAgo: "6 hours ago",
        image: "https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "Tech Giants Form Unprecedented AI Safety Alliance",
        subtitle: "Five major technology companies announce groundbreaking partnership to develop ethical AI standards.",
        views: "12,543 views",
        timeAgo: "1 day ago",
        image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "Global Markets Rally on Economic Recovery Signs",
        subtitle: "Stock markets worldwide surge as new economic data suggests stronger recovery.",
        views: "8,932 views",
        timeAgo: "2 days ago",
        image: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "Breakthrough Medical Treatment Shows Promise for Rare Disease",
        subtitle: "Clinical trials reveal 85% success rate for new gene therapy targeting previously incurable genetic condition.",
        views: "7,654 views",
        timeAgo: "3 days ago",
        image: "https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "Space Mission Discovers Potential Signs of Ancient Life",
        subtitle: "Mars rover findings suggest possible evidence of microbial life that existed billions of years ago.",
        views: "15,432 views",
        timeAgo: "4 days ago",
        image: "https://images.pexels.com/photos/73873/mars-mars-rover-space-travel-robot-73873.jpeg?auto=compress&cs=tinysrgb&w=400"
      }
    ],
    popularArticles: [
      {
        title: "Hackers Exploit Microsoft Software Vulnerability To Reportedly Target Governments And Businesses—What To Know",
        subtitle: "Microsoft released an emergency security patch on Sunday to 'mitigate active attacks targeting on-premises servers.'",
        trending: true,
        views: "19,216 views",
        timeAgo: "6 hours ago",
        image: "https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "Space Mission Discovers Potential Signs of Ancient Life",
        subtitle: "Mars rover findings suggest possible evidence of microbial life that existed billions of years ago.",
        views: "15,432 views",
        timeAgo: "4 days ago",
        image: "https://images.pexels.com/photos/73873/mars-mars-rover-space-travel-robot-73873.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "Tech Giants Form Unprecedented AI Safety Alliance",
        subtitle: "Five major technology companies announce groundbreaking partnership to develop ethical AI standards.",
        views: "12,543 views",
        timeAgo: "1 day ago",
        image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400"
      }
    ],
    archiveArticles: [
      {
        title: "The Rise of Quantum Computing: A New Era Begins",
        subtitle: "How quantum computers are set to revolutionize everything from cryptography to drug discovery.",
        views: "8,921 views",
        timeAgo: "2 weeks ago",
        publishDate: "January 15, 2024",
        image: "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "Climate Change Solutions: Innovation in Renewable Energy",
        subtitle: "Breakthrough technologies making clean energy more efficient and affordable than ever before.",
        views: "7,654 views",
        timeAgo: "3 weeks ago",
        publishDate: "January 8, 2024",
        image: "https://images.pexels.com/photos/9875414/pexels-photo-9875414.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "The Future of Work: Remote Collaboration Tools Transform Business",
        subtitle: "How new technologies are reshaping the workplace and enabling global collaboration.",
        views: "6,432 views",
        timeAgo: "1 month ago",
        publishDate: "December 28, 2023",
        image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "Breakthrough in Medical AI: Early Disease Detection",
        subtitle: "Machine learning algorithms now capable of detecting diseases years before symptoms appear.",
        views: "9,876 views",
        timeAgo: "1 month ago",
        publishDate: "December 20, 2023",
        image: "https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "Sustainable Cities: Urban Planning for the 21st Century",
        subtitle: "How smart city technologies are creating more livable, sustainable urban environments.",
        views: "5,321 views",
        timeAgo: "2 months ago",
        publishDate: "November 15, 2023",
        image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400"
      }
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button and Logo */}
            <div className="flex items-center">
              <button 
                onClick={onBack}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
            </div>

           
          </div>
        </div>
      </header>

      {/* Author Profile Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Author Header */}
        <div className="bg-white p-8 border-b border-gray-200">
          <div className="flex items-start gap-6">
            <div className="relative">
              <img 
                src={displayAuthor.avatar} 
                alt={displayAuthor.name}
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-3xl font-light text-gray-900">{displayAuthor.name}</h2>
               
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-600">{displayAuthor.title || 'MATV Staff'}</span>
                <span className="text-gray-400">|</span>
                <span className="text-blue-600 font-medium">{displayAuthor.category}</span>
              </div>
              <div className="flex items-center gap-4">

                
                {displayAuthor.socialLinks?.twitter && (
                  <a 
                    href={displayAuthor.socialLinks.twitter.startsWith('http') ? displayAuthor.socialLinks.twitter : `https://${displayAuthor.socialLinks.twitter}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {displayAuthor.socialLinks?.linkedin && (
                  <a 
                    href={displayAuthor.socialLinks.linkedin.startsWith('http') ? displayAuthor.socialLinks.linkedin : `https://${displayAuthor.socialLinks.linkedin}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white p-8 border-b border-gray-200">
          <p className="text-gray-700 leading-relaxed text-base">
            {displayAuthor.bio}
           
          </p>
        </div>
        
        {/* Ethical Guidelines */}
    

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200">
          <nav className="flex space-x-8 px-8">
            <button 
              onClick={() => setActiveTab('latest')}
              className="py-4 px-1 border-b-2 border-black text-black font-medium text-sm transition-colors"
            >
              Latest
            </button>
            {/* Commented out for now
            <button 
              onClick={() => setActiveTab('popular')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'popular' 
                  ? 'border-black text-black' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Popular
            </button>
            <button 
              onClick={() => setActiveTab('archive')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'archive' 
                  ? 'border-black text-black' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Archive
            </button>
            */}
          </nav>
        </div>

        {/* Latest Articles */}
        {activeTab === 'latest' && (
        <div className="bg-white">
          <div className="p-8">
            <div className="space-y-8">
              {(authorContent.length > 0 ? authorContent : displayAuthor.articles || []).map((article, index) => (
                <div key={index} className="flex gap-6 pb-8 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    {article.trending && (
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-green-600 text-sm font-medium">TRENDING</span>
                        <span className="text-gray-500 text-sm">• {article.views || 0} views • {article.timeAgo}</span>
                      </div>
                    )}
                    <a 
                      href={`/articles/${article._id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <h3 className="text-xl font-medium text-gray-900 mb-3 leading-tight hover:text-blue-600 cursor-pointer">
                        {article.title}
                      </h3>
                    </a>
                    <p className="text-gray-600 text-base leading-relaxed mb-4">
                      {article.subtitle}
                    </p>
                    {!article.trending && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <span>{article.views || 0} views</span>
                        <span>•</span>
                        <span>{article.timeAgo}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                    
                    </div>
                  </div>
                  <div className="w-40 h-24 flex-shrink-0">
                    <a 
                      href={`/articles/${article._id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <img 
                        src={article.image || 'https://via.placeholder.com/400x240'} 
                        alt={article.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-8">
              <button 
                onClick={handleLoadMore}
                disabled={contentLoading || !hasMoreContent}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {contentLoading ? 'Loading...' : 
                 !hasMoreContent ? 'No More Articles' : 'Load More Articles'}
              </button>
            </div>

            {/* Advertisement placeholder */}
            <div className="mt-12 text-right">
              <span className="text-xs text-gray-400 uppercase tracking-wide">Advertisement</span>
            </div>
          </div>
        </div>
        )}

        {/* Popular Articles */}
        {activeTab === 'popular' && (
        <div className="bg-white">
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Most Popular Articles</h2>
              <p className="text-gray-600">Articles ranked by views and engagement</p>
            </div>
            <div className="space-y-6">
              {(displayAuthor.popularArticles || []).map((article, index) => (
                <div key={index} className="flex gap-6 pb-6 border-b border-gray-100 last:border-b-0">
                  <div className="w-16 h-16 flex-shrink-0 bg-red-600 text-white rounded-lg flex items-center justify-center font-bold text-xl">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    {article.trending && (
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-green-600 text-sm font-medium">TRENDING</span>
                      </div>
                    )}
                    <a 
                      href={`/articles/${article._id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight hover:text-blue-600 cursor-pointer">
                        {article.title}
                      </h3>
                    </a>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      {article.subtitle}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {article.views}
                      </span>
                      <span>•</span>
                      <span>{article.timeAgo}</span>
                   
                    </div>
                  </div>
                  <div className="w-24 h-16 flex-shrink-0">
                    <a 
                      href={`/articles/${article._id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <img 
                        src={article.image || 'https://via.placeholder.com/400x240'} 
                        alt={article.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-8">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
                Load More Popular Articles
              </button>
            </div>
          </div>
        </div>
        )}

        {/* Archive Articles */}
        {activeTab === 'archive' && (
        <div className="bg-white">
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Archive</h2>
              <p className="text-gray-600">Browse articles by publication date</p>
            </div>
            
            {/* Archive Filter */}
            <div className="mb-8 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Archive className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter by:</span>
              </div>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>All Time</option>
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
              </select>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>All Categories</option>
                <option>Technology</option>
                <option>Business</option>
                <option>Health</option>
                <option>Science</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(displayAuthor.archiveArticles || []).map((article, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-16 flex-shrink-0">
                      <a 
                        href={`/articles/${article._id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <img 
                          src={article.image || 'https://via.placeholder.com/400x240'} 
                          alt={article.title}
                          className="w-full h-full object-cover rounded"
                        />
                      </a>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{article.publishDate}</span>
                      </div>
                      <a 
                        href={`/articles/${article._id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <h3 className="text-base font-semibold text-gray-900 mb-2 leading-tight hover:text-blue-600 cursor-pointer">
                          {article.title}
                        </h3>
                      </a>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                        {article.subtitle}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{article.views}</span>
                     
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-8">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
                Load More Archive Articles
              </button>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default AuthorProfile;