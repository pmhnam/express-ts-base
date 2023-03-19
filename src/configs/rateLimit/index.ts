/* eslint-disable @typescript-eslint/no-unused-vars */
import { rateLimit } from 'express-rate-limit';
import { config } from 'dotenv';

config();

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message: 'Too many requests, please try again later.',
  skip: (req, res) => {
    // Skip rate limiting for frontend requests
    if (req.ip === '127.0.0.1' || req.hostname === process.env.FRONTEND_DOMAIN) {
      return false;
    }
    return true;
  },
});
