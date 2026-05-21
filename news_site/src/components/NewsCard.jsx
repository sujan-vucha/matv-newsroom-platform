import React from 'react';
import { Play, Clock, Eye } from 'lucide-react';

const NewsCard = ({
  title,
  summary,
  category,
  timeAgo,
  imageUrl,
  isLive = false,
  isVideo = false,
  eyewitness = false,
  size = 'medium',
  views
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'col-span-1 row-span-1';
      case 'large':
        return 'col-span-2 row-span-2 md:col-span-1 md:row-span-1 lg:col-span-2 lg:row-span-2';
      default:
        return 'col-span-1 row-span-1';
    }
  };

  const getCategoryColor = () => {
    switch (category.toLowerCase()) {
      case 'world':
        return 'bg-blue-600';
      case 'politics':
        return 'bg-purple-600';
      case 'uk':
        return 'bg-green-600';
      case 'sports':
        return 'bg-orange-600';
      case 'business':
        return 'bg-indigo-600';
      case 'eyewitness':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className={`group relative overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${getSizeClasses()}`}>
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
            <div className="bg-white bg-opacity-90 rounded-full p-3 group-hover:bg-opacity-100 transition-colors">
              <Play className="w-6 h-6 text-red-600" fill="currentColor" />
            </div>
          </div>
        )}
        
        {isLive && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            LIVE
          </div>
        )}
        
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <span className={`${getCategoryColor()} text-white px-2 py-1 rounded text-xs font-semibold uppercase`}>
            {category}
          </span>
          {eyewitness && (
            <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
              <Eye className="w-3 h-3" />
              EYEWITNESS
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className={`font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 ${size === 'large' ? 'text-xl mb-2' : 'text-sm mb-1'}`}>
          {title}
        </h3>
        
        {summary && size === 'large' && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">{summary}</p>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{timeAgo}</span>
          </div>
          {views && (
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{views}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsCard;