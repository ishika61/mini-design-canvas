const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const canvasRoutes = require('./routes/canvasRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Health check — useful for confirming the server is up
app.get('/', (req, res) => {
  res.json({ message: 'Mini Design Canvas API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/canvases', canvasRoutes);

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Central error handler — must be last
app.use(errorHandler);

module.exports = app;