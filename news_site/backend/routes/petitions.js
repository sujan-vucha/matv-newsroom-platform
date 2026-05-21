import express from 'express';
import mongoose from 'mongoose';
import Petition from '../models/Petition.js';
import Signature from '../models/Signature.js';

const router = express.Router();

// Get default petition or create one if none exists
router.get('/', async (req, res) => {
  try {
    let petition = await Petition.findOne();
    
    if (!petition) {
      petition = new Petition({
        title: 'Save Nimisha Priya',
        description: 'Help save the life of a Malayali nurse on death row in Yemen',
        targetSignatures: 1000,
        currentSignatures: 784
      });
      await petition.save();
    }

    res.json(petition);
  } catch (error) {
    console.error('Error fetching petition:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific petition by ID
router.get('/:id', async (req, res) => {
  try {
    const petitionId = req.params.id;
    const petition = await Petition.findById(petitionId);
    
    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }
    
    res.json(petition);
  } catch (error) {
    console.error('Error fetching petition:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get petition statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const petitionId = req.params.id;
    const signatureCount = await Signature.countDocuments({ petitionId });
    
    // Get unique locations count
    const uniqueLocations = await Signature.aggregate([
      { $match: { petitionId: new mongoose.Types.ObjectId(petitionId) } },
      { 
        $group: { 
          _id: { 
            $arrayElemAt: [
              { $split: ["$location", "\n"] }, 
              0
            ]
          }
        }
      },
      { $count: "total" }
    ]);
    
    const locationCount = uniqueLocations.length > 0 ? uniqueLocations[0].total : 0;
    
    // Get recent signatures
    const recentSignatures = await Signature.find({ petitionId, displayName: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('firstName lastName location createdAt');

    res.json({
      totalSignatures: signatureCount,
      totalLocations: locationCount,
      recentSignatures: recentSignatures.map(sig => ({
        name: `${sig.firstName} ${sig.lastName}`,
        location: sig.location.split('\n')[0], // Get first line of location
        time: getTimeAgo(sig.createdAt)
      }))
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to format time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours === 1) {
    return '1 hour ago';
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
  }
}

export default router;