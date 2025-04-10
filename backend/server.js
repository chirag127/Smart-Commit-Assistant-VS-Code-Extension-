const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const commitRoutes = require('./routes/commit');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/', commitRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: err.message || 'Internal Server Error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Smart Commit Assistant API running on port ${PORT}`);
});

module.exports = app;
