import express from 'express';
import RajneetiBooking from '../models/RajneetiBooking.js';
const router = express.Router();

// Create new booking
router.post('/', async (req, res) => {
  try {
    console.log('Received booking data:', req.body);
    console.log('Portfolio URL:', req.body.portfolioUrl);
    const booking = new RajneetiBooking(req.body);
    await booking.save();
    res.status(201).json({ message: 'Booking submitted successfully', booking });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await RajneetiBooking.find().sort({ submittedAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update booking status
router.patch('/:id', async (req, res) => {
  try {
    const booking = await RajneetiBooking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete booking
router.delete('/:id', async (req, res) => {
  try {
    await RajneetiBooking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;