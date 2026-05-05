const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  tableNumber: { type: String, required: true },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    quantity: { type: Number, required: true },
    name: { type: String },
    price: { type: String }
  }],
  total: { type: String, required: true },
  status: { type: String, default: 'Pending' }, // Pending, Preparing, Ready, Delivered, Cancelled
  prepTime: { type: Number, default: null } // Estimated preparation time in minutes
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
