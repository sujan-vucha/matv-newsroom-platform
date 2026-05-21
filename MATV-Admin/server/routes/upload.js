import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/gif',
      'image/webp',
      'image/avif'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed'), false);
    }
  }
});

const getImageExtension = (file) => {
  const originalExt = path.extname(file.originalname || '').toLowerCase();
  if (originalExt) return originalExt;

  const mimeExtensions = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/avif': '.avif'
  };

  return mimeExtensions[file.mimetype] || '.jpg';
};

const saveImageFile = async (file) => {
  const filename = `image-${Date.now()}-${Math.round(Math.random() * 1E9)}${getImageExtension(file)}`;
  const filePath = path.join(uploadsDir, filename);

  await fs.promises.writeFile(filePath, file.buffer);

  return {
    filename,
    imageUrl: `/uploads/${filename}`
  };
};

// Upload single image endpoint
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ error: 'Only image files are allowed' });
    }

    const savedFile = await saveImageFile(req.file);

    res.json({
      success: true,
      ...savedFile
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Image upload failed', details: error.message });
  }
});

// Upload multiple images endpoint
router.post('/images', upload.array('images', 10), async (req, res) => {
  try {
    const files = req.files || [];

    if (files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    const savedFiles = await Promise.all(files.map(saveImageFile));

    res.json({
      success: true,
      images: savedFiles
    });
  } catch (error) {
    console.error('Images upload error:', error);
    res.status(500).json({ error: 'Images upload failed', details: error.message });
  }
});

// Upload portfolio endpoint
router.post('/portfolio', upload.single('portfolio'), async (req, res) => {
  try {
    console.log('Portfolio upload request received');
    console.log('File:', req.file ? 'Present' : 'Missing');
    console.log('Cloudinary config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'NOT SET',
      api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET'
    });
    
    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Upload to Cloudinary
    console.log('Starting Cloudinary upload...');
    const isPDF = req.file.mimetype === 'application/pdf';
    
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: isPDF ? 'raw' : 'auto',
          folder: 'rajneeti-portfolios',
          public_id: `portfolio_${Date.now()}`,
          ...(isPDF && { format: 'pdf' })
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary error:', error);
            reject(error);
          } else {
            console.log('Cloudinary success:', result.secure_url);
            resolve(result);
          }
        }
      ).end(req.file.buffer);
    });

    res.json({ 
      success: true, 
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error('Upload error details:', error);
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
});

// Download proxy endpoint
router.get('/download/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter required' });
    }

    console.log('Downloading file from:', url);
    
    // Set headers to force download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/pdf');
    
    // Simple redirect approach
    res.redirect(url);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
});

// Simple download proxy
router.get('/download', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'URL required' });
  }
  
  try {
    const https = await import('https');
    const urlObj = new URL(url);
    
    // Detect file type from URL
    const urlPath = urlObj.pathname.toLowerCase();
    let filename = 'portfolio';
    let contentType = 'application/octet-stream';
    
    if (urlPath.includes('.pdf')) {
      filename = 'portfolio.pdf';
      contentType = 'application/pdf';
    } else if (urlPath.includes('.jpg') || urlPath.includes('.jpeg')) {
      filename = 'portfolio.jpg';
      contentType = 'image/jpeg';
    } else if (urlPath.includes('.png')) {
      filename = 'portfolio.png';
      contentType = 'image/png';
    }
    
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET'
    };
    
    const request = https.default.request(options, (response) => {
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', contentType);
      response.pipe(res);
    });
    
    request.on('error', (error) => {
      console.error('Download error:', error);
      res.status(500).json({ error: 'Download failed' });
    });
    
    request.end();
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
});

export default router;
