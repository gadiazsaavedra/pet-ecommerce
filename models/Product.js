const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  category: { type: String, required: true },
  petType: { type: String, required: true }, // 'dog', 'cat', 'bird', 'rodent', 'reptile', 'fish'
  subcategory: String,
  brand: String,
  images: [String],
  specifications: {
    size: String,
    weight: String,
    material: String,
    color: String
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

productSchema.index({ category: 1, petType: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);