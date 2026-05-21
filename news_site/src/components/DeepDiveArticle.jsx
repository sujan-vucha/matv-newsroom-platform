import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_BACKEND_URL;

export default function DeepDiveArticle() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`${API}/api/deepdive/${id}`);
        setArticle(res.data);
      } catch (err) {
        console.error('❌ Error loading article:', err);
      }
    };

    fetchArticle();
  }, [id]);

  if (!article) {
    return <div className="text-center py-12 text-gray-600">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{article.heading || article.title}</h1>
      <p className="text-red-600 font-medium">{article.category}</p>
      <p className="text-gray-500 text-sm mb-4">Updated Article · 3 min read</p>

      {article.image && (
        <img
          src={article.image}
          alt="Main"
          className="w-full h-auto rounded-lg mb-6 shadow"
        />
      )}

      <div className="space-y-6 text-gray-800">
        {article.sections?.map((sec, idx) => (
          <div key={idx}>
            {sec.subheading && (
              <h2 className="text-xl font-bold mb-2">{sec.subheading}</h2>
            )}
            {sec.paragraph && <p>{sec.paragraph}</p>}
            {sec.image && (
              <img
                src={sec.image}
                alt="section"
                className="w-full mt-2 rounded shadow"
              />
            )}
            {sec.video && (
              <div className="mt-4">
                <iframe
                  width="100%"
                  height="315"
                  src={sec.video}
                  title="Video"
                  allowFullScreen
                  className="rounded"
                ></iframe>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
