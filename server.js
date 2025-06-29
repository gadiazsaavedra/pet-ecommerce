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

// Seed route for production
app.post('/api/seed', async (req, res) => {
  const Product = require('./models/Product');
  const sampleProducts = [
    {
      name: "Plato Giratorio",
      description: "Diametro 17.5CM",
      price: 5600,
      stock: 10,
      category: "feeders",
      petType: "rodent",
      images: ["/images/image1.png"],
      specifications: { size: "17.5CM", color: "Celeste" }
    },
    {
      name: "Bebedero Automático",
      description: "Capacidad 250ml",
      price: 3200,
      stock: 15,
      category: "feeders",
      petType: "rodent",
      images: ["/images/image2.jpeg"],
      specifications: { size: "250ml", color: "Transparente" }
    },
    {
      name: "Rueda de Ejercicio",
      description: "Diametro 20CM",
      price: 8900,
      stock: 8,
      category: "toys",
      petType: "rodent",
      images: ["/images/image3.png"],
      specifications: { size: "20CM", color: "Amarillo" }
    }
  ];
  
  try {
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    res.json({ success: true, imported: sampleProducts.length });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pet-ecommerce')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});