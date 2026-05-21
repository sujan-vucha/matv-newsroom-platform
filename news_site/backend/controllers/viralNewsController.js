// backend/controllers/viralNewsController.js
import ViralNews from '../models/ViralNews.js';

export const getAllViralNews = async (req, res) => {
  try {
    const news = await ViralNews.find();
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch viral news' });
  }
};

export const getSingleViralNews = async (req, res) => {
  try {
    const story = await ViralNews.findOne({ slug: req.params.id }) || await ViralNews.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Not found' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load story' });
  }
};

export const updateAllViralNews = async (req, res) => {
  try {
    const data = req.body;

    // Optional: Basic validation
    if (!Array.isArray(data)) return res.status(400).json({ message: "Data must be an array" });

    // Delete all and insert new
    await ViralNews.deleteMany({});
    const inserted = await ViralNews.insertMany(data);

    res.status(200).json({ message: 'Viral news updated', count: inserted.length });
  } catch (err) {
    console.error('❌ Update Error:', err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};
