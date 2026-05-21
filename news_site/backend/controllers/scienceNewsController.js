import ScienceNews from '../models/ScienceNews.js';

export const getAllScienceNews = async (req, res) => {
  try {
    const news = await ScienceNews.find();
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch Science news' });
  }
};

export const getSingleScienceNews = async (req, res) => {
  try {
    const story =
      (await ScienceNews.findOne({ slug: req.params.id })) ||
      (await ScienceNews.findById(req.params.id));
    if (!story) return res.status(404).json({ message: 'Not found' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load story' });
  }
};

export const updateAllScienceNews = async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: 'Data must be an array' });
    }

    // Delete existing and insert new Science news
    await ScienceNews.deleteMany({});
    const inserted = await ScienceNews.insertMany(data);

    res.status(200).json({ message: 'Science news updated', count: inserted.length });
  } catch (err) {
    console.error('❌ Update Error:', err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};
