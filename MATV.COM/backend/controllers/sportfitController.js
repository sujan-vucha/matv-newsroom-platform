import Sportfit from '../models/Sportfit.js';

export const getAllSportfit = async (req, res) => {
  try {
    const news = await Sportfit.find();
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch sportfit articles' });
  }
};

export const getSingleSportfit = async (req, res) => {
  try {
    const story =
      (await Sportfit.findOne({ slug: req.params.id })) ||
      (await Sportfit.findById(req.params.id));
    if (!story) return res.status(404).json({ message: 'Not found' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load sportfit article' });
  }
};

export const updateAllSportfit = async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: 'Data must be an array' });
    }

    await Sportfit.deleteMany({});
    const inserted = await Sportfit.insertMany(data);

    res.status(200).json({ message: 'Sportfit articles updated', count: inserted.length });
  } catch (err) {
    console.error('❌ Update Error:', err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};
