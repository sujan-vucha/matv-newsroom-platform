// backend/models/Matv.js
import mongoose from 'mongoose';

const matvSchema = new mongoose.Schema({
  mainStory: {
    title: String,
    image: String
  },
  liveUpdates: [
    {
      time: String,
      text: String
    }
  ],
  centerCard: {
    title: String,
    image: String
  },
  centerList: [String],
  economicImpact: [
    {
      image: String,
      text: String
    }
  ],
  mustRead: [
    {
      image: String,
      text: String
    }
  ],
  opinion: [
    {
      image: String,
      text: String,
      author: String
    }
  ]
});

export default mongoose.model('Matv', matvSchema);
