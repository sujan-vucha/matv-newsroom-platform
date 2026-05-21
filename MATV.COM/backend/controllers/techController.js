import Tech from '../models/Tech.js';

export const getAllTech = async (req, res) => {
  try {
    const news = await Tech.find();
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tech news' });
  }
};

export const getSingleTech = async (req, res) => {
  try {
    const story =
      (await Tech.findOne({ slug: req.params.id })) ||
      (await Tech.findById(req.params.id));
    if (!story) return res.status(404).json({ message: 'Not found' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load tech article' });
  }
};

export const updateAllTech = async (req, res) => {
  try {
    const data = req.body;
    if (!Array.isArray(data)) {
      return res.status(400).json({ message: 'Data must be an array' });
    }
    await Tech.deleteMany({});
    const inserted = await Tech.insertMany(data);
    res.status(200).json({ message: 'Tech news updated', count: inserted.length });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};
