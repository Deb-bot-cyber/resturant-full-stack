const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');

router.get('/dashboard-summary', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({ status: { $ne: 'Cancelled' } });
    const totalGuests = await User.countDocuments({ role: 'customer' });
    
    const orders = await Order.find({ status: { $ne: 'Cancelled' } });
    const totalRevenue = orders.reduce((sum, order) => {
      const numericPrice = parseFloat(order.total.replace(/[^0-9.]/g, '')) || 0;
      return sum + numericPrice;
    }, 0);

    const avgTicketSize = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Get popular items (simplified)
    const allOrders = await Order.find();
    const itemCounts = {};
    allOrders.forEach(order => {
      order.items.forEach(item => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
      });
    });

    const popularItems = Object.entries(itemCounts)
      .map(([name, count]) => ({ name, sales: count }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 4);

    res.json({
      stats: {
        totalRevenue: `$${totalRevenue.toLocaleString()}`,
        totalOrders,
        totalGuests,
        avgTicketSize: `$${avgTicketSize.toFixed(2)}`
      },
      recentOrders,
      popularItems
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
