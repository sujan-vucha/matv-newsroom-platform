// backend/controllers/latestNewsController.js
import LatestNews from '../models/LatestNews.js';

export const getAllLatestNews = async (req, res) => {
  try {
    const news = await LatestNews.find();
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch latest news' });
  }
};

export const getSingleLatestNews = async (req, res) => {
  try {
    const story =
      (await LatestNews.findOne({ slug: req.params.id })) ||
      (await LatestNews.findById(req.params.id));
    if (!story) return res.status(404).json({ message: 'Not found' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load story' });
  }
};

export const updateAllLatestNews = async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: 'Data must be an array' });
    }

    // Delete existing and insert new latest news
    await LatestNews.deleteMany({});
    const inserted = await LatestNews.insertMany(data);

    res.status(200).json({ message: 'Latest news updated', count: inserted.length });
  } catch (err) {
    console.error('❌ Update Error:', err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};
