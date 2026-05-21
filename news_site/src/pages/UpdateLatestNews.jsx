import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

export default function UpdateLatestNews() {
  const [formData, setFormData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/latest-news`)
      .then((res) => setFormData(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error('❌ Failed to load latest news:', err));
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...formData];
    updated[index][field] = value;
    if (field === 'title') {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      updated[index]['slug'] = generatedSlug;
    }
    setFormData(updated);
  };

  const handleImageUpload = async (index, file) => {
    const imageData = new FormData();
    imageData.append('file', file);
    setUploading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        imageData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      handleChange(index, 'image', res.data.imageUrl);
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('❌ Image upload failed');
    }
    setUploading(false);
  };

  const handleAdd = () => {
    setFormData((prev) => [
      ...prev,
      { title: '', image: '', content: '', category: '', slug: '' },
    ]);
  };

  const handleDelete = (index) => {
    const updated = formData.filter((_, i) => i !== index);
    setFormData(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/latest-news`, formData)
      .then(() => alert('✅ Latest news updated successfully.'))
      .catch((err) => {
        console.error('❌ Submit Error:', err);
        alert('❌ Failed to update latest news.');
      });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">📰 Update Latest News</h1>
      <form onSubmit={handleSubmit}>
        {formData.map((item, index) => (
          <div key={index} className="bg-white border rounded-lg p-6 mb-6 shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={item.title}
                  onChange={(e) => handleChange(index, 'title', e.target.value)}
                  placeholder="Enter news title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={item.category}
                  onChange={(e) => handleChange(index, 'category', e.target.value)}
                  placeholder="Politics, Health, Tech etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Slug (URL ID)</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={item.slug || ''}
                  onChange={(e) => handleChange(index, 'slug', e.target.value)}
                  placeholder="Auto-generated or custom slug"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(index, e.target.files[0])}
                />
              </div>

              {item.image && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Preview</label>
                  <img
                    src={item.image}
                    alt="Uploaded Preview"
                    className="w-full max-h-64 object-cover rounded"
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows={6}
                  value={item.content || ''}
                  onChange={(e) => handleChange(index, 'content', e.target.value)}
                  placeholder="Enter news content (HTML allowed)"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="text-red-600 hover:underline text-sm"
              >
                🗑️ Delete This News
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={handleAdd}
            className="text-blue-600 hover:underline text-sm"
          >
            ➕ Add New News Item
          </button>
          <button
            type="submit"
            disabled={uploading}
            className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? 'Uploading Image...' : '💾 Save All News'}
          </button>
        </div>
      </form>
    </div>
  );
}
