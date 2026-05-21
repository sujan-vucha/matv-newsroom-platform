// backend/controllers/matvController.js
import Matv from '../models/Matv.js';

export const updateMatv = async (req, res) => {
  try {
    const existing = await Matv.findOne();
    if (existing) {
      await Matv.findByIdAndUpdate(existing._id, req.body);
    } else {
      await Matv.create(req.body);
    }
    res.json({ message: 'MATV updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMatv = async (req, res) => {
  try {
    const data = await Matv.findOne();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
