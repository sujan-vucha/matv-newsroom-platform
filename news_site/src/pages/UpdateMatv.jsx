import React, { useState } from "react";
import axios from "axios";

const UpdateMatv = () => {
  const [form, setForm] = useState({
    mainStory: {
      title: "ON THE BRINK: Pakistan Launches Missile Strikes on 25 Indian Targets",
      image: ""
    },
    liveUpdates: `5m ago: India responds to strikes with air defense systems\n15m ago: Loud explosions reported in Srinagar\n30m ago: US urges both nations to de-escalate\n45m ago: Indian Prime Minister holds emergency cabinet meeting\n1h ago: UN Security Council calls urgent session\n1h 15m ago: Civilian shelters activated across Punjab region`,
    centerCard: {
      title: "India-Pakistan Conflict Could Disrupt Global Trade Routes",
      image: ""
    },
    centerList: `Military analysts warn of prolonged standoff\nRed alerts issued in border states\nAirlines reroute flights away from conflict zone\nEvacuation protocols activated in key metro areas\nInternet and mobile restrictions imposed in sensitive zones`,
    economicImpact: [],
    mustRead: [],
    opinion: []
  });

  const handleChange = (e, section, key) => {
    if (key) {
      setForm({ ...form, [section]: { ...form[section], [key]: e.target.value } });
    } else {
      setForm({ ...form, [section]: e.target.value });
    }
  };

  const handleImageUpload = async (file, section, index, key) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (index !== undefined) {
        const updatedList = [...form[section]];
        updatedList[index][key] = res.data.imageUrl;
        setForm(prev => ({ ...prev, [section]: updatedList }));
      } else {
        setForm(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            [key]: res.data.imageUrl
          }
        }));
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload image");
    }
  };

  const handleAddItem = (section, template) => {
    setForm(prev => ({
      ...prev,
      [section]: [...prev[section], { ...template }]
    }));
  };

  const handleUpdateItem = (section, index, field, value) => {
    const updatedList = [...form[section]];
    updatedList[index][field] = value;
    setForm(prev => ({ ...prev, [section]: updatedList }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      mainStory: form.mainStory,
      liveUpdates: form.liveUpdates.split("\n").filter(item => item.includes(":"))
        .map(item => {
          const [time, ...text] = item.split(":");
          return {
            time: time?.trim() || "",
            text: text.join(":").trim()
          };
        }),
      centerCard: form.centerCard,
      centerList: form.centerList.split("\n").map(item => item.trim()).filter(Boolean),
      economicImpact: form.economicImpact,
      mustRead: form.mustRead,
      opinion: form.opinion
    };

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/matv/update`, payload);
      alert("MATV section updated successfully.");
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update MATV section.");
    }
  };

  return (
    <form className="space-y-6 p-6 max-w-4xl mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold">Update MATV Section</h2>

      <div>
        <label>Main Story Title</label>
        <input type="text" className="w-full border p-2" value={form.mainStory.title} onChange={(e) => handleChange(e, 'mainStory', 'title')} />
        <label>Main Story Image</label>
        <input type="file" className="w-full border p-2" onChange={(e) => handleImageUpload(e.target.files[0], 'mainStory', undefined, 'image')} />
        {form.mainStory.image && <img src={form.mainStory.image} alt="main story" className="mt-2 h-32 object-cover" />}
      </div>

      <div>
        <label>Live Updates (one per line, format: time: update)</label>
        <textarea className="w-full border p-2 h-40" value={form.liveUpdates} onChange={(e) => handleChange(e, 'liveUpdates')} />
      </div>

      <div>
        <label>Center Card Title</label>
        <input type="text" className="w-full border p-2" value={form.centerCard.title} onChange={(e) => handleChange(e, 'centerCard', 'title')} />
        <label>Center Card Image</label>
        <input type="file" className="w-full border p-2" onChange={(e) => handleImageUpload(e.target.files[0], 'centerCard', undefined, 'image')} />
        {form.centerCard.image && <img src={form.centerCard.image} alt="center card" className="mt-2 h-32 object-cover" />}
      </div>

      <div>
        <label>Center List (one per line)</label>
        <textarea className="w-full border p-2 h-40" value={form.centerList} onChange={(e) => handleChange(e, 'centerList')} />
      </div>

      {["economicImpact", "mustRead", "opinion"].map(section => (
        <div key={section}>
          <label className="capitalize">{section.replace(/([A-Z])/g, ' $1')}</label>
          {form[section].map((item, index) => (
            <div key={index} className="mb-4">
              <input
                type="file"
                className="border p-1 mb-1"
                onChange={(e) => handleImageUpload(e.target.files[0], section, index, 'image')}
              />
              <input
                type="text"
                placeholder="Text"
                className="w-full border p-2 mb-1"
                value={item.text || ''}
                onChange={(e) => handleUpdateItem(section, index, 'text', e.target.value)}
              />
              {section === 'opinion' && (
                <input
                  type="text"
                  placeholder="Author"
                  className="w-full border p-2 mb-1"
                  value={item.author || ''}
                  onChange={(e) => handleUpdateItem(section, index, 'author', e.target.value)}
                />
              )}
              {item.image && <img src={item.image} alt="preview" className="h-20 object-cover mt-1" />}
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddItem(section, section === 'opinion' ? { image: '', text: '', author: '' } : { image: '', text: '' })}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
          >
            ➕ Add {section.replace(/([A-Z])/g, ' $1')}
          </button>
        </div>
      ))}

      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">Update</button>
    </form>
  );
};

export default UpdateMatv;
