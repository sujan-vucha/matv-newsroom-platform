import { useState } from "react";
import axios from "axios";

export default function UpdateHomepage() {
  const [headline, setHeadline] = useState("India-Pakistan Border Tensions Rise Amid Diplomatic Standoff");
  const [mainImage, setMainImage] = useState("");
  const [trending, setTrending] = useState("India-Pakistan Conflict, Supreme Court Verdict, Lok Sabha Elections 2024, ISRO's Chandrayaan-4 Mission, India vs Australia T20, Global Climate Summit");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trendingTopics = trending.split(",").map(topic => topic.trim());

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/homepage`, {
        headline,
        mainImage,
        trendingTopics
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      alert("Homepage updated successfully!");
    } catch (error) {
      alert("Failed to update homepage");
      console.error(error);
    }
  };

  const fetchFromNewsAPI = async () => {
    try {
      const apiKey = import.meta.env.VITE_GNEWS_API_KEY;
      const res = await axios.get(`https://gnews.io/api/v4/top-headlines?lang=en&max=5&apikey=${apiKey}`);

      const articles = res.data.articles;
      const topHeadline = articles[0]?.title || "";
      const topImage = articles[0]?.image || "";
      const topics = articles.map(article => article.title);

      setHeadline(topHeadline);
      setMainImage(topImage);
      setTrending(topics.join(", "));
    } catch (err) {
      console.error("Failed to fetch from news API", err);
    }
  };

  const handleMainImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMainImage(res.data.imageUrl);
    } catch (err) {
      console.error("Main image upload failed", err);
      alert("❌ Failed to upload main image");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white border border-blue-200 rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-4">📰 Update Homepage Content</h1>

      <button
        onClick={fetchFromNewsAPI}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        🔄 Fetch Latest News from GNews
      </button>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Headline</label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="e.g. India-Pakistan Border Tensions..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Upload Main Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleMainImageUpload(e.target.files[0])}
            className="block w-full text-sm text-gray-600"
          />
          {mainImage && <img src={mainImage} alt="Main Preview" className="mt-2 w-full h-40 object-cover rounded border" />}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Trending Topics (comma separated)</label>
          <textarea
            value={trending}
            onChange={(e) => setTrending(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            rows="10"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          💾 Save Homepage
        </button>
      </form>
    </div>
  );
}
