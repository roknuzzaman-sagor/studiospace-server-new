require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth.routes');
const studioRoutes = require('./src/routes/studio.routes');
const bookingRoutes = require('./src/routes/booking.routes');
const wishlistRoutes = require('./src/routes/wishlist.routes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ CORS — support multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, mobile)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ Ensure DB is connected before every request (serverless-safe)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    return res.status(500).json({ message: 'Database connection failed' });
  }
});

app.get('/', (req, res) =>
  res.json({ message: 'StudioSpace API running', status: 'ok' })
);

app.use('/api/auth', authRoutes);
app.use('/api/studios', studioRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/wishlist', wishlistRoutes);

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use(errorHandler);

// ✅ Only listen when running locally (NOT on Vercel)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// ✅ MUST export for Vercel serverless
module.exports = app;