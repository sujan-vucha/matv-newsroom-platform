import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_BACKEND_URL;

export default function UpdateDeepDive() {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formMap, setFormMap] = useState({});

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await axios.get(`${API}/api/deepdive`);
    let data = res.data;

    while (data.length < 4) {
      data.push({
        _id: `placeholder-${data.length}`,
        title: '',
        category: '',
        img: '',
        content: '',
        heading: '',
        image: '',
        sections: [{ subheading: '', paragraph: '', image: '', video: '' }],
        isPlaceholder: true
      });
    }

    setItems(data);
    const init = {};
    data.forEach(item => init[item._id] = { ...item });
    setFormMap(init);
  };

  const handleFieldChange = (id, field, value) => {
    setFormMap(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSectionChange = (id, index, field, value) => {
    const sections = [...(formMap[id].sections || [])];
    sections[index][field] = value;
    handleFieldChange(id, 'sections', sections);
  };

  const handleImageUpload = async (id, field, file, sectionIndex = null) => {
    const imageData = new FormData();
    imageData.append('file', file);
    try {
      const res = await axios.post(`${API}/api/upload`, imageData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (sectionIndex !== null) {
        handleSectionChange(id, sectionIndex, field, res.data.imageUrl);
      } else {
        handleFieldChange(id, field, res.data.imageUrl);
      }
    } catch (error) {
      alert('❌ Failed to upload image');
    }
  };

  const addSection = (id) => {
    const sections = [...(formMap[id].sections || [])];
    sections.push({ subheading: '', paragraph: '', image: '', video: '' });
    handleFieldChange(id, 'sections', sections);
  };

  const removeSection = (id, index) => {
    const sections = [...(formMap[id].sections || [])];
    sections.splice(index, 1);
    handleFieldChange(id, 'sections', sections);
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`${API}/api/deepdive/${id}`, formMap[id]);
      alert('✅ Card updated successfully!');
      setEditingId(null);
      fetchItems();
    } catch (error) {
      alert('❌ Failed to update');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">🧠 Manage Deep Dive Cards & Articles</h2>

      {items.map(item => {
        const form = formMap[item._id] || {};

        return (
          <div key={item._id} className="border p-4 rounded mb-8 bg-white shadow">
            <h3 className="font-bold mb-2 text-lg">Card {items.indexOf(item) + 1}</h3>

            {editingId === item._id ? (
              <>
                <label className="block text-sm font-medium">Card Title</label>
                <input className="w-full mb-2 p-2 border rounded"
                  value={form.title}
                  onChange={e => handleFieldChange(item._id, 'title', e.target.value)}
                />

                <label className="block text-sm font-medium">Category</label>
                <input className="w-full mb-2 p-2 border rounded"
                  value={form.category}
                  onChange={e => handleFieldChange(item._id, 'category', e.target.value)}
                />

                <label className="block text-sm font-medium">Card Image</label>
                <input type="file" onChange={(e) => handleImageUpload(item._id, 'img', e.target.files[0])} />
                {form.img && <img src={form.img} alt="card" className="h-32 mt-2 mb-2 rounded" />}

                <label className="block text-sm font-medium">Card Summary</label>
                <textarea className="w-full mb-2 p-2 border rounded"
                  value={form.content}
                  onChange={e => handleFieldChange(item._id, 'content', e.target.value)}
                />

                <label className="block text-sm font-medium">Article Heading</label>
                <input className="w-full mb-2 p-2 border rounded"
                  value={form.heading}
                  onChange={e => handleFieldChange(item._id, 'heading', e.target.value)}
                />

                <label className="block text-sm font-medium">Main Article Image</label>
                <input type="file" onChange={(e) => handleImageUpload(item._id, 'image', e.target.files[0])} />
                {form.image && <img src={form.image} alt="article" className="h-32 mt-2 mb-2 rounded" />}

                <h4 className="text-md font-bold mb-2 mt-4">📑 Article Sections</h4>
                {(form.sections || []).map((sec, i) => (
                  <div key={i} className="border p-3 mb-3 rounded bg-gray-50">
                    <label className="block text-sm font-medium">Subheading</label>
                    <input className="w-full mb-2 p-2 border rounded"
                      value={sec.subheading}
                      onChange={e => handleSectionChange(item._id, i, 'subheading', e.target.value)}
                    />

                    <label className="block text-sm font-medium">Paragraph</label>
                    <textarea className="w-full mb-2 p-2 border rounded"
                      value={sec.paragraph}
                      onChange={e => handleSectionChange(item._id, i, 'paragraph', e.target.value)}
                    />

                    <label className="block text-sm font-medium">Image (optional)</label>
                    <input type="file" onChange={(e) => handleImageUpload(item._id, 'image', e.target.files[0], i)} />
                    {sec.image && <img src={sec.image} alt="section" className="h-24 mt-2 mb-2 rounded" />}

                    <label className="block text-sm font-medium">Video URL (YouTube)</label>
                    <input className="w-full mb-2 p-2 border rounded"
                      value={sec.video}
                      onChange={e => handleSectionChange(item._id, i, 'video', e.target.value)}
                    />

                    <button onClick={() => removeSection(item._id, i)} className="text-red-600 text-sm mt-2">🗑️ Remove Section</button>
                  </div>
                ))}
                <button onClick={() => addSection(item._id)} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm mb-4">➕ Add Section</button>

                <div className="flex gap-3">
                  <button onClick={() => handleUpdate(item._id)} className="bg-green-600 text-white px-4 py-2 rounded">💾 Save</button>
                  <button onClick={() => setEditingId(null)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-4 items-center">
                  <img src={item.img} alt="Card" className="w-28 h-20 object-cover rounded" />
                  <div>
                    <p className="text-sm text-red-600">{item.category}</p>
                    <h4 className="text-lg font-semibold">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.content?.slice(0, 80)}...</p>
                  </div>
                </div>
                <button onClick={() => setEditingId(item._id)} className="mt-2 bg-blue-600 text-white px-4 py-1 rounded">✏️ Edit</button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
