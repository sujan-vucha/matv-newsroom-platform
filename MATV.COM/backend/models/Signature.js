import mongoose from 'mongoose';

const signatureSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  displayName: {
    type: Boolean,
    default: true
  },
  petitionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Petition',
    required: true
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  verified: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate signatures from same email for same petition
signatureSchema.index({ email: 1, petitionId: 1 }, { unique: true });

export default mongoose.model('Signature', signatureSchema);