import WorldNews from '../models/WorldNews.js'; // Your Mongoose model

export const getWorldNews = async (req, res) => {
  try {
    const data = await WorldNews.findOne({});
    if (!data) {
      return res.json({ worldNews: [], recommended: [] });
    }
    console.log("📤 Sending world news:", data);
    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching world news:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateWorldNews = async (req, res) => {
  try {
    const { worldNews, recommended } = req.body;

    console.log("📝 Saving world news:", { worldNews, recommended });

    const updated = await WorldNews.findOneAndUpdate(
      {},
      { worldNews, recommended },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Content updated', data: updated });
  } catch (error) {
    console.error('❌ Error updating world news:', error.message);
    res.status(500).json({ error: 'Server error', detail: error.message });
  }
};
