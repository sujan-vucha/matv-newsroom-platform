import express from 'express';
import Signature from '../models/Signature.js';
import Petition from '../models/Petition.js';
import emailService from '../services/emailService.js';

const router = express.Router();

// Sign petition
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, location, displayName, petitionId } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !location) {
      return res.status(400).json({ 
        message: 'All fields are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Please enter a valid email address' 
      });
    }

    // Get default petition if no petitionId provided
    let petition;
    if (petitionId) {
      petition = await Petition.findById(petitionId);
    } else {
      petition = await Petition.findOne();
    }

    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }

    // Check if user already signed
    const existingSignature = await Signature.findOne({ 
      email: email.toLowerCase(), 
      petitionId: petition._id 
    });

    if (existingSignature) {
      return res.status(400).json({ 
        message: 'You have already signed this petition' 
      });
    }

    // Create new signature
    const signature = new Signature({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      location: location.trim(),
      displayName: displayName || true,
      petitionId: petition._id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await signature.save();

    // Update petition signature count
    await Petition.findByIdAndUpdate(petition._id, {
      $inc: { currentSignatures: 1 },
      updatedAt: new Date()
    });

    // Send emails (don't block the response if email fails)
    const userName = `${signature.firstName} ${signature.lastName}`;
    
    // Send confirmation email to user
    emailService.sendConfirmationEmail(signature.email, userName, petition)
      .catch(error => console.error('Failed to send confirmation email:', error));
    
    // Send notification to organizer
    emailService.sendOrganizerNotification(signature, petition)
      .catch(error => console.error('Failed to send organizer notification:', error));

    res.status(201).json({ 
      message: 'Thank you for signing the petition!',
      signature: {
        id: signature._id,
        name: `${signature.firstName} ${signature.lastName}`,
        createdAt: signature.createdAt
      }
    });

  } catch (error) {
    console.error('Error signing petition:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'You have already signed this petition' 
      });
    }
    
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Get signatures for a petition
router.get('/petition/:petitionId', async (req, res) => {
  try {
    const { petitionId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const signatures = await Signature.find({ 
      petitionId, 
      displayName: true 
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('firstName lastName location createdAt');

    const total = await Signature.countDocuments({ 
      petitionId, 
      displayName: true 
    });

    res.json({
      signatures: signatures.map(sig => ({
        name: `${sig.firstName} ${sig.lastName}`,
        location: sig.location.split('\n')[0],
        createdAt: sig.createdAt
      })),
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching signatures:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;