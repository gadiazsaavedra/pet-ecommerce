const mongoose = require('mongoose');
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

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();