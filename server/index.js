const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // For production, you might want to restrict this to your Vercel URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const menuRoutes = require('./routes/menu');
const reviewRoutes = require('./routes/reviews');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const eventRoutes = require('./routes/events');
const statsRoutes = require('./routes/stats');

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/stats', statsRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('Restaurant API is running...');
});

// MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@resturant1.ylc1f0f.mongodb.net/artisan-feast?appName=Resturant1';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected to Cloud'))
  .catch(err => console.log('❌ MongoDB Connection Error:', err));

mongoose.connection.on('error', err => {
  console.log('❌ MongoDB Runtime Error:', err);
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
