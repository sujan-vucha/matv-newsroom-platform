import Entertainment from '../models/Entertainment.js';

export const getAllEntertainment = async (req, res) => {
  try {
    const news = await Entertainment.find();
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch entertainment articles' });
  }
};

export const getSingleEntertainment = async (req, res) => {
  try {
    const story =
      (await Entertainment.findOne({ slug: req.params.id })) ||
      (await Entertainment.findById(req.params.id));
    if (!story) return res.status(404).json({ message: 'Not found' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load entertainment article' });
  }
};

export const updateAllEntertainment = async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: 'Data must be an array' });
    }

    await Entertainment.deleteMany({});
    const inserted = await Entertainment.insertMany(data);

    res.status(200).json({ message: 'Entertainment articles updated', count: inserted.length });
  } catch (err) {
    console.error('❌ Update Error:', err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};
