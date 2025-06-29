const XLSX = require('xlsx');
const Product = require('../models/Product');

const categoryMapping = {
  'cuchas': 'beds',
  'camas': 'beds',
  'transporte': 'transport',
  'jaulas': 'transport',
  'paseo': 'walking',
  'correas': 'walking',
  'juguetes': 'toys',
  'comida': 'food',
  'snacks': 'treats',
  'comederos': 'feeders',
  'bebederos': 'feeders',
  'higiene': 'hygiene'
};

const petTypeMapping = {
  'perro': 'dog',
  'gato': 'cat',
  'ave': 'bird',
  'roedor': 'rodent',
  'reptil': 'reptile',
  'pez': 'fish'
};

async function importFromExcel(filePath) {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const products = [];
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const imageNumber = i + 1;
      const product = {
        name: row['Producto'] || '',
        description: row['Medida'] || '',
        price: parseFloat(row['Valor']) || 0,
        stock: 10,
        category: 'feeders',
        petType: 'rodent',
        brand: '',
        images: [`/images/image${imageNumber}.jpeg`, `/images/image${imageNumber}.png`].filter(img => {
          const fs = require('fs');
          return fs.existsSync(`./public${img}`);
        }),
        specifications: {
          size: row['Medida'] || '',
          weight: '',
          material: '',
          color: row['Colores'] || ''
        }
      };
      
      if (product.name && product.price > 0) {
        products.push(product);
      }
    }

    await Product.insertMany(products);
    return { success: true, imported: products.length };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function mapCategory(category) {
  const normalized = category.toLowerCase().trim();
  return categoryMapping[normalized] || 'other';
}

function mapPetType(petType) {
  const normalized = petType.toLowerCase().trim();
  return petTypeMapping[normalized] || 'other';
}

module.exports = { importFromExcel };