const mongoose = require('mongoose');
require('dotenv').config();

const Category = require('./models/Category');
const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');
const Review = require('./models/Review');
const User = require('./models/User');
const Blog = require('./models/Blog');
const Event = require('./models/Event');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/artisan-feast';

const categories = [
  { name: 'Starters' },
  { name: 'Tandoor Specials' },
  { name: 'Main Curries' },
  { name: 'Biryani & Rice' },
  { name: 'Breads' },
  { name: 'Desserts' }
];

const menuItems = [
  {
    name: 'Murgh Malai Tikka',
    category: 'Tandoor Specials',
    price: '$18.00',
    description: 'Succulent chicken pieces marinated in cream, cheese, and mild spices, grilled to perfection.',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=2030&auto=format&fit=crop'
  },
  {
    name: 'Old Delhi Butter Chicken',
    category: 'Main Curries',
    price: '$22.00',
    description: 'Velvety tomato gravy enriched with butter and cream, served with tender tandoori chicken.',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=2070&auto=format&fit=crop'
  },
  {
    name: 'Awadhi Lamb Biryani',
    category: 'Biryani & Rice',
    price: '$26.00',
    description: 'Fragrant long-grain basmati rice dum-cooked with tender lamb and aromatic spices.',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=2070&auto=format&fit=crop'
  },
  {
    name: 'Paneer Lababdar',
    category: 'Main Curries',
    price: '$20.00',
    description: 'Cottage cheese cubes simmered in a luscious tomato-onion gravy with a hint of cashew.',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=1974&auto=format&fit=crop'
  },
  {
    name: 'Galouti Kebab',
    category: 'Starters',
    price: '$16.00',
    description: 'Melt-in-your-mouth minced meat kebabs from the royal kitchens of Lucknow.',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=2030&auto=format&fit=crop'
  },
  {
    name: 'Garlic Naan',
    category: 'Breads',
    price: '$5.00',
    description: 'Leavened bread topped with garlic and cilantro, baked in a clay oven.',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2070&auto=format&fit=crop'
  },
  {
    name: 'Gulab Jamun with Rabri',
    category: 'Desserts',
    price: '$10.00',
    description: 'Warm milk dumplings soaked in saffron syrup, served with thickened sweetened milk.',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=1935&auto=format&fit=crop'
  }
];

const reviews = [
  {
    author: 'Vikram Seth',
    role: 'Food Blogger',
    content: 'The Biryani takes me straight back to the streets of Lucknow. Truly authentic flavors.',
    rating: 5,
    image: 'https://i.pravatar.cc/150?u=v1',
    isApproved: true
  },
  {
    author: 'Anjali Sharma',
    role: 'Regular Patron',
    content: 'The Butter Chicken is the best I have had outside of India. Creamy and perfectly spiced.',
    rating: 5,
    image: 'https://i.pravatar.cc/150?u=a1',
    isApproved: true
  },
  {
    author: 'Rahul Kapoor',
    role: 'Chef',
    content: 'Impressive use of spices. The Galouti Kebab is a must-try for any meat lover.',
    rating: 5,
    image: 'https://i.pravatar.cc/150?u=r1',
    isApproved: true
  }
];

const events = [
  {
    title: 'Sitar & Sufi Night',
    description: 'An evening of soulful Sufi music accompanied by a live Sitar performance and a royal feast.',
    date: '2026-06-20',
    time: '20:00',
    location: 'Maharaja Lounge',
    image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?q=80&w=2070&auto=format&fit=crop',
    price: '$95.00'
  },
  {
    title: 'Spice Masterclass',
    description: 'Learn the ancient art of spice blending with our executive chef.',
    date: '2026-06-25',
    time: '11:00',
    location: 'Artisan Kitchen',
    image: 'https://images.unsplash.com/photo-1596797038530-2c39ac90d01b?q=80&w=1935&auto=format&fit=crop',
    price: '$60.00'
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for Indian rebranding...');

    await Category.deleteMany({});
    await MenuItem.deleteMany({});
    await Review.deleteMany({});
    await Blog.deleteMany({});
    await Event.deleteMany({});
    await Order.deleteMany({});
    await User.deleteMany({});

    const insertedCategories = await Category.insertMany(categories);
    
    // Map category names to their new IDs for menu items
    const menuItemsWithIds = menuItems.map(item => {
      const cat = insertedCategories.find(c => c.name === item.category);
      return { ...item, category: cat ? cat._id : null };
    });

    await MenuItem.insertMany(menuItemsWithIds);
    await Review.insertMany(reviews);
    await Event.insertMany(events);

    const adminUser = await User.findOneAndUpdate(
      { email: 'admin@artisanfeast.com' },
      { name: 'Maharaja Admin', role: 'admin', password: 'adminpassword123' },
      { upsert: true, returnDocument: 'after' }
    );
    console.log(`Admin user ensured: ${adminUser.email}`);

    console.log('Indian Rebranding Seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
