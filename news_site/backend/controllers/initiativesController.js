import Initiatives from '../models/Initiatives.js';

export const getAllInitiatives = async (req, res) => {
  try {
    const data = await Initiatives.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch initiatives' });
  }
};

export const getSingleInitiative = async (req, res) => {
  try {
    const story =
      (await Initiatives.findOne({ slug: req.params.id })) ||
      (await Initiatives.findById(req.params.id));
    if (!story) return res.status(404).json({ message: 'Not found' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load initiative' });
  }
};

export const updateAllInitiatives = async (req, res) => {
  try {
    const data = req.body;
    if (!Array.isArray(data)) {
      return res.status(400).json({ message: 'Data must be an array' });
    }
    await Initiatives.deleteMany({});
    const inserted = await Initiatives.insertMany(data);
    res.status(200).json({ message: 'Initiatives updated', count: inserted.length });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};
