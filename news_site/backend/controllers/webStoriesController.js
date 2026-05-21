import WebStory from '../models/WebStory.js';

export const getAllWebStories = async (req, res) => {
  try {
    const stories = await WebStory.find();
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch web stories' });
  }
};

export const getSingleWebStory = async (req, res) => {
  try {
    const story =
      (await WebStory.findOne({ slug: req.params.id })) ||
      (await WebStory.findById(req.params.id));
    if (!story) return res.status(404).json({ message: 'Not found' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load story' });
  }
};

export const updateAllWebStories = async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: 'Data must be an array' });
    }

    // Replace all web stories with the new set
    await WebStory.deleteMany({});
    const inserted = await WebStory.insertMany(data);

    res.status(200).json({ message: 'Web stories updated', count: inserted.length });
  } catch (err) {
    console.error('❌ Update Error:', err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};
