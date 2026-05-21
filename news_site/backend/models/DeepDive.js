import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  subheading: String,
  paragraph: String,
  image: String,
  video: String,
});

const deepDiveSchema = new mongoose.Schema({
  title: String,
  category: String,
  img: String,
  content: String,
  heading: String,
  image: String,
  sections: [sectionSchema],
});

export default mongoose.model('DeepDive', deepDiveSchema);
