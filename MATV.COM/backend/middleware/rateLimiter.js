import rateLimit from 'express-rate-limit';

// Rate limiting for signing petitions
export const signPetitionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 signature attempts per windowMs
  message: {
    message: 'Too many signature attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiting
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    message: 'Too many requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});