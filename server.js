require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes');
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully!'))
  .catch(err => console.error('MongoDB Connection Error:', err));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);