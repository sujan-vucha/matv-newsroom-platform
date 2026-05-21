// src/pages/DeepDiveArticle.jsx

import React from 'react';
import { useParams } from 'react-router-dom';
import deepDiveItems from '../data/deepDiveData';

const DeepDiveArticle = () => {
  const { id } = useParams();
  const article = deepDiveItems.find((item) => item.id === id);

  if (!article) {
    return <div className="p-8">Article not found.</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <p className="text-sm font-semibold text-red-700 mb-2">{article.category}</p>
      <img src={article.img} alt={article.title} className="w-full h-auto mb-6 rounded-lg shadow" />
      <p className="text-gray-700 text-lg">{article.content}</p>
    </div>
  );
};

export default DeepDiveArticle;
