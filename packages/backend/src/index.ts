import express from 'express';
import cors from 'cors';
import { connectRedis } from './db/redis';
import config from './config/env';

// Import routes
import authRoutes from './routes/auth';
import oauthRoutes from './routes/oauth';
import userRoutes from './routes/users';
import activityRoutes from './routes/activity';

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
// Remove or comment out this line if you're not using it
// app.use('/api/auth', authRoutes);
app.use('/oauth', oauthRoutes);
app.use('/users', userRoutes);
app.use('/activity', activityRoutes);

// Add after route registration
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Add a catch-all route to log 404s
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.path}`);
  res.status(404).send('Not Found');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
const start = async () => {
  try {
    // Connect to Redis
    await connectRedis();
    
    // Start server
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start(); 