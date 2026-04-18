import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import testimonialRoutes from './routes/testimonials.js';
import purchaseRoutes from './routes/purchases.js';
import meetingRoutes from './routes/meetings.js';
import moduleRoutes from './routes/modules.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/modules', moduleRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI!)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

export default app;