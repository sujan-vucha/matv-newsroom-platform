import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UpdateWorldNews() {
  const [formData, setFormData] = useState({ worldNews: [], recommended: [] });

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/world-news`)
      .then(res => {
        const data = res.data || {};
        setFormData({
          worldNews: Array.isArray(data.worldNews) ? data.worldNews : [],
          recommended: Array.isArray(data.recommended) ? data.recommended : []
        });
      })
      .catch(err => console.error('Failed to fetch content:', err));
  }, []);

  const handleChange = (type, index, field, value) => {
    setFormData(prev => {
      const updatedSection = prev[type].map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      );
      return { ...prev, [type]: updatedSection };
    });
  };

  const handleAdd = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: [...(Array.isArray(prev[type]) ? prev[type] : []), { title: '', image: '', link: '', category: '' }]
    }));
  };

  const handleFileUpload = async (e, type, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileData = new FormData();
    fileData.append('file', file);

    try {
      const uploadRes = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        fileData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      const imageUrl = uploadRes.data.imageUrl;
      console.log("✅ Uploaded image URL:", imageUrl);

      setFormData(prev => {
        const updated = [...prev[type]];
        updated[index] = { ...updated[index], image: imageUrl };
        console.log("🧠 Updated entry:", updated[index]);
        return { ...prev, [type]: updated };
      });

    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Failed to upload image');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("📦 Raw formData before cleaning:", formData);

    const cleanData = (arr) =>
      arr
        .filter(item => item.title?.trim() && item.image?.trim())
        .map(({ _id, ...rest }) => ({ ...rest }));

    const cleanedWorldNews = cleanData(formData.worldNews);
    const cleanedRecommended = cleanData(formData.recommended);

    console.log("🧾 Cleaned formData before submit:", {
      worldNews: cleanedWorldNews,
      recommended: cleanedRecommended
    });

    if (cleanedWorldNews.length === 0 && cleanedRecommended.length === 0) {
      alert("⚠️ No valid entries to save. Please add at least one item with image and title.");
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/world-news`, {
        worldNews: cleanedWorldNews,
        recommended: cleanedRecommended
      })
      .then(() => alert('✅ Content updated successfully!'))
      .catch(err => {
        console.error("❌ Error submitting form:", err);
        alert('❌ Failed to update content');
      });
  };

  return (
    
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-3xl font-bold mb-6 text-center">📰 Manage World News & Recommended</h1>
      <form onSubmit={handleSubmit}>

        {['worldNews', 'recommended'].map((section) => (
          <div key={section} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">
              {section === 'worldNews' ? '🌍 World News' : '⭐ Recommended'}
            </h2>

            {formData[section]?.map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-sm mb-1">Title</label>
                    <input
                      type="text"
                      placeholder="Enter news title"
                      className="p-2 border rounded w-full"
                      value={item.title}
                      onChange={(e) => handleChange(section, idx, 'title', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-sm mb-1">Link to Article</label>
                    <input
                      type="text"
                      placeholder="https://example.com/article"
                      className="p-2 border rounded w-full"
                      value={item.link}
                      onChange={(e) => handleChange(section, idx, 'link', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-sm mb-1">Category</label>
                    <input
                      type="text"
                      placeholder="Politics, Tech, Sports..."
                      className="p-2 border rounded w-full"
                      value={item.category}
                      onChange={(e) => handleChange(section, idx, 'category', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-sm mb-1">Upload Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, section, idx)}
                    />
                    {item.image && (
                      <div className="mt-2 flex items-center gap-2">
                        <img src={item.image} alt="preview" className="h-12 w-12 object-cover border rounded" />
                        <span className="text-xs text-gray-500 truncate">{item.image.split('/').pop()}</span>
                      </div>
                    )}
                    {/* Add visible debug image value */}
                    <pre className="text-xs text-gray-400">image: {item.image}</pre>
                  </div>
                </div>
              </div>
            ))}

            <div className="text-right">
              <button
                type="button"
                onClick={() => handleAdd(section)}
                className="mt-2 text-blue-600 font-semibold hover:underline"
              >
                + Add {section === 'worldNews' ? 'World News' : 'Recommended'} Item
              </button>
            </div>
          </div>
        ))}

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            ✅ Save All Changes
          </button>
        </div>
      </form>
    </div>
  );
}
