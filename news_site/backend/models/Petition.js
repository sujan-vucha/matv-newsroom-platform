import mongoose from 'mongoose';

const petitionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Save Nimisha Priya'
  },
  description: {
    type: String,
    required: true
  },
  targetSignatures: {
    type: Number,
    default: 1000
  },
  currentSignatures: {
    type: Number,
    default: 0
  },
  decisionMaker: {
    type: String,
    default: 'Government of India & Yemen Authorities'
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'successful'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Petition', petitionSchema);