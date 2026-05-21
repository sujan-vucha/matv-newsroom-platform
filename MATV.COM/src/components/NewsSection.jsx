import React from 'react';
import NewsCard from './NewsCard';

const NewsSection = ({ title, stories }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <div className="w-16 h-1 bg-red-600 rounded"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stories.map((story) => (
          <NewsCard
            key={story.id}
            title={story.title}
            summary={story.summary}
            category={story.category}
            timeAgo={story.timeAgo}
            imageUrl={story.imageUrl}
            isLive={story.isLive}
            isVideo={story.isVideo}
            views={story.views}
          />
        ))}
      </div>
    </section>
  );
};

export default NewsSection;