import mongoose from 'mongoose';

const rajneetiBookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  preferredTime: {
    type: String
  },
  expertise: {
    type: String
  },
  message: {
    type: String
  },
  whyPodcast: {
    type: String
  },
  topicsToDiscuss: {
    type: String
  },
  pastEngagements: {
    type: String
  },
  portfolioUrl: {
    type: String
  },
  socialMediaLinks: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('RajneetiBooking', rajneetiBookingSchema);