import IndiaNews from '../models/IndiaNews.js';

export const getAllIndiaNews = async (req, res) => {
  try {
    const news = await IndiaNews.find();
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch India news' });
  }
};

export const getSingleIndiaNews = async (req, res) => {
  try {
    const story =
      (await IndiaNews.findOne({ slug: req.params.id })) ||
      (await IndiaNews.findById(req.params.id));
    if (!story) return res.status(404).json({ message: 'Not found' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load story' });
  }
};

export const updateAllIndiaNews = async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: 'Data must be an array' });
    }

    // Delete existing and insert new India news
    await IndiaNews.deleteMany({});
    const inserted = await IndiaNews.insertMany(data);

    res.status(200).json({ message: 'India news updated', count: inserted.length });
  } catch (err) {
    console.error('❌ Update Error:', err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};
