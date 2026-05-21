import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("DB Error", err));

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const user = await User.findOne({ email: 'admin@channel.com' });
  if (user) {
    console.log("Admin already exists");
    process.exit();
  }

  await User.create({
    email: 'admin@channel.com',
    password: hashedPassword,
    role: 'admin'
  });

  console.log("Admin created");
  process.exit();
}

createAdmin();
