import Education from '../models/Education.js';

export const getAllEducation = async (req, res) => {
  try {
    const news = await Education.find();
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch education articles' });
  }
};

export const getSingleEducation = async (req, res) => {
  try {
    const story =
      (await Education.findOne({ slug: req.params.id })) ||
      (await Education.findById(req.params.id));
    if (!story) return res.status(404).json({ message: 'Not found' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load education article' });
  }
};

export const updateAllEducation = async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: 'Data must be an array' });
    }

    await Education.deleteMany({});
    const inserted = await Education.insertMany(data);

    res.status(200).json({ message: 'Education articles updated', count: inserted.length });
  } catch (err) {
    console.error('❌ Update Error:', err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};
