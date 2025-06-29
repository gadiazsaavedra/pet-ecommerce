const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/products', require('./routes/products'));

// Import route
app.post('/api/import-excel', async (req, res) => {
  const { importFromExcel } = require('./utils/excelImporter');
  const result = await importFromExcel('./Accesorios Roedores Comercio Abr25.xlsx');
  res.json(result);
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pet-ecommerce')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});