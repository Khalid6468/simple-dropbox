const express = require('express');
const path = require('path');
const cors = require('cors');
const fileRoutes = require('./routes/files');

const app = express();

app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', fileRoutes);

module.exports = app; 