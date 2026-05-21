import Defence from '../models/Defence.js';

export const getAllDefence = async (req, res) => {
  try {
    const news = await Defence.find();
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch defence articles' });
  }
};

export const getSingleDefence = async (req, res) => {
  try {
    const story =
      (await Defence.findOne({ slug: req.params.id })) ||
      (await Defence.findById(req.params.id));
    if (!story) return res.status(404).json({ message: 'Not found' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load defence article' });
  }
};

export const updateAllDefence = async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: 'Data must be an array' });
    }

    await Defence.deleteMany({});
    const inserted = await Defence.insertMany(data);

    res.status(200).json({ message: 'Defence articles updated', count: inserted.length });
  } catch (err) {
    console.error('❌ Update Error:', err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};
