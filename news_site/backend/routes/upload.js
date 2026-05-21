import express from 'express';
import multer from 'multer';
import cloudinaryPkg from 'cloudinary'; // ✅ CommonJS default import
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import util from 'util';

dotenv.config();

const cloudinary = cloudinaryPkg.v2; // ✅ Extract v2 manually

const router = express.Router();

// ✅ Cloudinary config
console.log('Cloudinary config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET'
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Storage config
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'news-images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }],
  },
});

const upload = multer({ storage });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      console.log("❌ No file or path");
      return res.status(400).json({ error: 'File not received or upload failed' });
    }

    console.log("✅ Upload success:");
    console.log(util.inspect(req.file, { depth: null, colors: true }));

    return res.status(200).json({
      success: true,
      imageUrl: req.file.path,
    });

  } catch (err) {
    console.error("❌ Upload failed:", err.message);
    return res.status(500).json({
      error: 'Upload failed',
      message: err.message,
    });
  }
});

// Portfolio upload route
router.post('/portfolio', upload.single('portfolio'), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      console.log("❌ No portfolio file or path");
      return res.status(400).json({ error: 'Portfolio file not received or upload failed' });
    }

    console.log("✅ Portfolio upload success:");
    console.log(util.inspect(req.file, { depth: null, colors: true }));

    return res.status(200).json({
      success: true,
      url: req.file.path,
    });

  } catch (err) {
    console.error("❌ Portfolio upload failed:", err.message);
    return res.status(500).json({
      error: 'Portfolio upload failed',
      message: err.message,
    });
  }
});

export default router;
