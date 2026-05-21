import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import uploadRoutes from './routes/upload.js';

import homepageRoutes from './routes/homepage.js'
import userRoutes from './routes/auth.js'
import matvRoutes from './routes/matv.js';
import deepDiveRoutes from './routes/deepDive.js';
import worldNewsRoutes from './routes/worldNewsRoutes.js';
import viralNewsRoutes from './routes/viralNewsRoutes.js';
import latestNewsRoutes from './routes/latestNewsRoutes.js'
import indiaNewsRoutes from './routes/indiaNewsRoutes.js';
import webStoriesRoutes from './routes/webStoriesRoutes.js';
import scienceNewsRoutes from './routes/scienceNewsRoutes.js';
import opinionRoutes from './routes/opinionRoutes.js';
import entertainmentRoutes from './routes/entertainmentRoutes.js';
import defenceRoutes from './routes/defenceRoutes.js';
import sportfitRoutes from './routes/sportfitRoutes.js';
import educationRoutes from './routes/educationRoutes.js';
import electionNewsRoutes from './routes/electionNewsRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import techRoutes from './routes/techRoutes.js';
import intiativesRoutes from './routes/initiativesRoutes.js';
import allVideoRoutes from './routes/allVideoRoutes.js';
import liveTvRoutes from './routes/liveTvRoutes.js';
import emailService from './services/emailService.js';
import petitionRoutes from './routes/petitions.js';
import signatureRoutes from './routes/signatures.js';
import { generalLimiter, signPetitionLimiter } from './middleware/rateLimiter.js';






dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


emailService.testConnection();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5174',
  credentials: true
}));




app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));




app.use('/api/users', userRoutes)          
app.use('/api/homepage', homepageRoutes)
app.use('/api/matv', matvRoutes);
app.use('/api/deepdive', deepDiveRoutes);
app.use('/api/world-news', worldNewsRoutes);
app.use("/api/viral-news", viralNewsRoutes);
app.use("/api/latest-news", latestNewsRoutes);
app.use('/api/india-news', indiaNewsRoutes);
app.use('/api/web-stories', webStoriesRoutes);
app.use('/api/science-news', scienceNewsRoutes);
app.use('/api/opinion', opinionRoutes);
app.use('/api/entertainment', entertainmentRoutes);
app.use('/api/defence', defenceRoutes);
app.use('/api/sportfit', sportfitRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/election-news', electionNewsRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/tech', techRoutes);
app.use('/api/initiatives',intiativesRoutes);
app.use('/api/videos', allVideoRoutes);
app.use('/api/live-tv', liveTvRoutes);
app.use('/api/upload', uploadRoutes);





// Apply rate limiting
app.use('/api/', generalLimiter);

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Routes
app.use('/api/petitions', petitionRoutes);
app.use('/api/signatures', signPetitionLimiter, signatureRoutes);





app.get('/', (req, res) => {
  res.send('API is working!');
});






mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log('Server running on port', process.env.PORT || 5000);
    });
  })
  .catch(err => console.error('MongoDB connection failed:', err));



  
