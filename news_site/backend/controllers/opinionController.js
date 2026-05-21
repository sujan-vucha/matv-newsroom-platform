import Opinion from '../models/Opinion.js';

export const getAllOpinion = async (req, res) => {
  try {
    const news = await Opinion.find();
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch opinion articles' });
  }
};

export const getSingleOpinion = async (req, res) => {
  try {
    const story =
      (await Opinion.findOne({ slug: req.params.id })) ||
      (await Opinion.findById(req.params.id));
    if (!story) return res.status(404).json({ message: 'Not found' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load opinion article' });
  }
};

export const updateAllOpinion = async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: 'Data must be an array' });
    }

    await Opinion.deleteMany({});
    const inserted = await Opinion.insertMany(data);

    res.status(200).json({ message: 'Opinion articles updated', count: inserted.length });
  } catch (err) {
    console.error('❌ Update Error:', err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};
