import ElectionNews from '../models/ElectionNews.js';

export const getAllElectionNews = async (req, res) => {
  try {
    const news = await ElectionNews.find();
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch election news' });
  }
};

export const getSingleElectionNews = async (req, res) => {
  try {
    const story =
      (await ElectionNews.findOne({ slug: req.params.id })) ||
      (await ElectionNews.findById(req.params.id));
    if (!story) return res.status(404).json({ message: 'Not found' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load election news article' });
  }
};

export const updateAllElectionNews = async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: 'Data must be an array' });
    }

    await ElectionNews.deleteMany({});
    const inserted = await ElectionNews.insertMany(data);

    res.status(200).json({ message: 'Election news updated', count: inserted.length });
  } catch (err) {
    console.error('❌ Update Error:', err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};
