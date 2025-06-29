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

// Seed route for production (GET method for easy browser access)
app.get('/api/seed', async (req, res) => {
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
    },
    {
      name: "Casa para Hámster",
      description: "Casa de madera natural",
      price: 12500,
      stock: 5,
      category: "beds",
      petType: "rodent",
      images: ["/images/image4.png"],
      specifications: { size: "15x10CM", material: "Madera", color: "Natural" }
    },
    {
      name: "Collar para Perro",
      description: "Collar ajustable de nylon",
      price: 2800,
      stock: 20,
      category: "walking",
      petType: "dog",
      images: ["/images/image5.jpeg"],
      specifications: { size: "Ajustable", material: "Nylon", color: "Azul" }
    },
    {
      name: "Juguete para Gato",
      description: "Ratón de peluche con sonido",
      price: 1500,
      stock: 25,
      category: "toys",
      petType: "cat",
      images: ["/images/image6.jpeg"],
      specifications: { size: "8CM", material: "Peluche", color: "Gris" }
    }
  ];
  
  try {
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      return res.json({ success: true, message: 'Database already has products', count: existingProducts });
    }
    
    await Product.insertMany(sampleProducts);
    res.json({ success: true, message: 'Database seeded successfully', imported: sampleProducts.length });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Original POST seed route for production
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

// Database status endpoint
app.get('/api/status', async (req, res) => {
  try {
    const Product = require('./models/Product');
    const productCount = await Product.countDocuments();
    const dbState = mongoose.connection.readyState;
    const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    
    res.json({
      database: {
        status: states[dbState] || 'unknown',
        connected: dbState === 1,
        productCount: productCount
      },
      mongodb_uri: process.env.MONGODB_URI ? 'Set' : 'Not set'
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pet-ecommerce')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});