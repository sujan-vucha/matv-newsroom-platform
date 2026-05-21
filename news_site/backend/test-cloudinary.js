import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileToUpload = path.join(__dirname, 'sample.jpg'); // Add a small test image in same folder

cloudinary.uploader.upload(fileToUpload, { folder: 'test-upload' })
  .then(result => {
    console.log("✅ Upload successful:", result.secure_url);
  })
  .catch(error => {
    console.error("❌ Cloudinary Upload Failed");
    console.error("🔴 Message:", error.message);
    console.error("📄 Full Error:", JSON.stringify(error, null, 2));
  });
