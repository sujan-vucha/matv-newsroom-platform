import Health from '../models/Health.js';

export const getAllHealth = async (req, res) => {
  try {
    const news = await Health.find();
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch health articles' });
  }
};

export const getSingleHealth = async (req, res) => {
  try {
    const story =
      (await Health.findOne({ slug: req.params.id })) ||
      (await Health.findById(req.params.id));
    if (!story) return res.status(404).json({ message: 'Not found' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load health article' });
  }
};

export const updateAllHealth = async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: 'Data must be an array' });
    }

    await Health.deleteMany({});
    const inserted = await Health.insertMany(data);

    res.status(200).json({ message: 'Health articles updated', count: inserted.length });
  } catch (err) {
    console.error('❌ Update Error:', err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};
