const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: String, required: true },
  status: { type: String, default: 'Available' }, // Available, Sold Out
  description: { type: String },
  image: { type: String } // Base64 string or URL
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
