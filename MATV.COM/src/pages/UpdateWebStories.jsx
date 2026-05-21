import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

export default function UpdateWebStories() {
  const [formData, setFormData] = useState([]);
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/web-stories`)
      .then((res) => setFormData(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error('Failed to load web stories', err));
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

  const handleAdd = () => {
    setFormData((prev) => [
      ...prev,
      { title: '', image: '', content: '', category: '', slug: '' },
    ]);
  };

  const handleDelete = (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this web story?");
    if (!confirmDelete) return;

    const updated = [...formData];
    updated.splice(index, 1);
    setFormData(updated);
  };

  const handleFileUpload = async (e, index) => {
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
      const updated = [...formData];
      updated[index].image = imageUrl;
      setFormData(updated);
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Failed to upload image');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanedData = formData.map((item) => {
      const trimmedTitle = item.title?.trim() || '';
      const autoSlug = trimmedTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      return {
        ...item,
        slug: item.slug?.trim() || autoSlug,
      };
    });

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/web-stories`, cleanedData)
      .then(() => alert('✅ Web stories updated successfully!'))
      .catch((err) => {
        console.error('Submit Error:', err);
        alert('❌ Failed to update web stories');
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">📸 Easy Web Stories Manager</h1>
      <p className="text-sm text-gray-600 text-center mb-8">Upload your image, enter a title, category, and description. The URL slug will auto-generate!</p>
      <form onSubmit={handleSubmit}>
        {formData.map((item, index) => (
          <div key={index} className="border p-4 mb-6 rounded-md shadow-md bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Web story title"
                  className="p-2 border rounded w-full"
                  value={item.title}
                  onChange={(e) => handleChange(index, 'title', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image Upload</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, index)} />
                {item.image && (
                  <img
                    src={item.image}
                    alt="preview"
                    className="h-16 mt-2 rounded border object-cover"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  placeholder="e.g., Travel, Food"
                  className="p-2 border rounded w-full"
                  value={item.category}
                  onChange={(e) => handleChange(index, 'category', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Slug (URL ID)</label>
                <input
                  type="text"
                  placeholder="Auto-generated or custom"
                  className="p-2 border rounded w-full"
                  value={item.slug || ''}
                  onChange={(e) => handleChange(index, 'slug', e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Content (HTML supported)</label>
              <textarea
                placeholder="Write story content here..."
                className="p-2 border rounded w-full"
                rows="4"
                value={item.content || ''}
                onChange={(e) => handleChange(index, 'content', e.target.value)}
              ></textarea>
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="mt-3 text-sm text-red-600 hover:underline"
              >
                ❌ Delete This Story
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAdd}
          className="bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 mb-4"
        >
          + Add Another Web Story
        </button>
        <br />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 shadow-md"
        >
          📅 Save All Changes
        </button>
      </form>
    </div>
  );
}
