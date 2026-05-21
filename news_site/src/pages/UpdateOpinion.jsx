import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

export default function UpdateOpinion() {
  const [formData, setFormData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/opinion`)
      .then((res) => setFormData(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error('Failed to load opinion articles', err));
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
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      handleChange(index, 'image', res.data.imageUrl);
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('❌ Failed to upload image');
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

    const cleanedData = formData.map((item) => {
      const title = item.title?.trim() || '';
      const autoSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      return {
        ...item,
        slug: item.slug?.trim() || autoSlug,
      };
    });

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/opinion`, cleanedData)
      .then(() => alert('✅ Opinion articles updated'))
      .catch((err) => {
        console.error('Submit Error:', err);
        alert('❌ Failed to update opinion articles');
      });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">📝 Update Opinion Articles</h1>
      <form onSubmit={handleSubmit}>
        {formData.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-lg border border-gray-200 rounded-xl p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={item.title}
                  onChange={(e) => handleChange(index, 'title', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={item.category}
                  onChange={(e) => handleChange(index, 'category', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={item.slug || ''}
                  onChange={(e) => handleChange(index, 'slug', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(index, e.target.files[0])}
                  className="w-full"
                />
              </div>

              {item.image && (
                <div className="md:col-span-2 mt-2">
                  <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
                  <img
                    src={item.image}
                    alt="Uploaded"
                    className="max-h-48 rounded border"
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  rows={5}
                  className="w-full p-2 border rounded"
                  placeholder="HTML allowed"
                  value={item.content || ''}
                  onChange={(e) => handleChange(index, 'content', e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="text-red-500 hover:underline text-sm"
              >
                🗑️ Delete Article
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={handleAdd}
            className="text-blue-600 hover:underline text-sm"
          >
            + Add Another Opinion Article
          </button>

          <button
            type="submit"
            disabled={uploading}
            className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? 'Uploading...' : '💾 Save All Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
