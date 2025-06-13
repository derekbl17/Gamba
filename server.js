const express = require('express');
const path = require('path');
const colors = require('colors');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/game', require('./routes/gameRoutes'));

// Serve static files from React frontend (in production)
if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, 'frontend', 'dist')));
    
    // Handle React routing, return all requests to React app
    app.get('*splat', (req, res) => {
      res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
    });
  }
// Error handling
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`.yellow.bold);
});