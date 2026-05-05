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
    price: '18.00',
    description: 'Succulent chicken pieces marinated in cream, cheese, and mild spices, grilled to perfection.',
    status: 'Available',
    isFavorite: true,
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=2030&auto=format&fit=crop'
  },
  {
    name: 'Old Delhi Butter Chicken',
    category: 'Main Curries',
    price: '22.00',
    description: 'Velvety tomato gravy enriched with butter and cream, served with tender tandoori chicken.',
    status: 'Available',
    isFavorite: true,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=2070&auto=format&fit=crop'
  },
  {
    name: 'Awadhi Lamb Biryani',
    category: 'Biryani & Rice',
    price: '26.00',
    description: 'Fragrant long-grain basmati rice dum-cooked with tender lamb and aromatic spices.',
    status: 'Available',
    isFavorite: true,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=2070&auto=format&fit=crop'
  },
  {
    name: 'Paneer Lababdar',
    category: 'Main Curries',
    price: '20.00',
    description: 'Cottage cheese cubes simmered in a luscious tomato-onion gravy with a hint of cashew.',
    status: 'Available',
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=1974&auto=format&fit=crop'
  },
  {
    name: 'Galouti Kebab',
    category: 'Starters',
    price: '16.00',
    description: 'Melt-in-your-mouth minced meat kebabs from the royal kitchens of Lucknow.',
    status: 'Available',
    isFavorite: true,
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=2030&auto=format&fit=crop'
  },
  {
    name: 'Dal Makhani',
    category: 'Main Curries',
    price: '18.00',
    description: 'Slow-cooked black lentils with kidney beans, cream, and butter. A 24-hour labor of love.',
    status: 'Available',
    isFavorite: true,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=2070&auto=format&fit=crop'
  },
  {
    name: 'Garlic Naan',
    category: 'Breads',
    price: '5.00',
    description: 'Leavened bread topped with garlic and cilantro, baked in a clay oven.',
    status: 'Available',
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2070&auto=format&fit=crop'
  },
  {
    name: 'Gulab Jamun with Rabri',
    category: 'Desserts',
    price: '10.00',
    description: 'Warm milk dumplings soaked in saffron syrup, served with thickened sweetened milk.',
    status: 'Available',
    isFavorite: true,
    image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=1935&auto=format&fit=crop'
  },
  {
    name: 'Tandoori Gobi',
    category: 'Starters',
    price: '14.00',
    description: 'Cauliflower florets marinated in spiced yogurt and roasted in the tandoor.',
    status: 'Available',
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=1974&auto=format&fit=crop'
  },
  {
    name: 'Mutton Rogan Josh',
    category: 'Main Curries',
    price: '24.00',
    description: 'Traditional Kashmiri lamb curry cooked with alkanet root and Kashmiri chilies.',
    status: 'Available',
    isFavorite: true,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=2070&auto=format&fit=crop'
  },
  {
    name: 'Hyderabadi Veg Biryani',
    category: 'Biryani & Rice',
    price: '20.00',
    description: 'Seasonal vegetables layered with basmati rice and saffron, cooked on "Dum".',
    status: 'Available',
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=2070&auto=format&fit=crop'
  },
  {
    name: 'Lacha Paratha',
    category: 'Breads',
    price: '6.00',
    description: 'Multi-layered flaky whole wheat bread baked in the tandoor.',
    status: 'Available',
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2070&auto=format&fit=crop'
  },
  {
    name: 'Kesar Pista Kulfi',
    category: 'Desserts',
    price: '12.00',
    description: 'Traditional Indian ice cream flavored with saffron and pistachios.',
    status: 'Available',
    isFavorite: true,
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
  },
  {
    author: 'Sanya Malhotra',
    role: 'Culinary Critic',
    content: 'A masterpiece of Indian dining. The Saffron atmosphere is as intoxicating as the food.',
    rating: 5,
    image: 'https://i.pravatar.cc/150?u=s1',
    isApproved: true
  },
  {
    author: 'Ishan Gupta',
    role: 'Foodie',
    content: 'Best Dal Makhani in town. You can really taste the 24-hour slow cooking process.',
    rating: 5,
    image: 'https://i.pravatar.cc/150?u=i1',
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
  },
  {
    title: 'Holi Saffron Brunch',
    description: 'A colorful celebration with traditional snacks, thandai, and a special festive menu.',
    date: '2026-03-25',
    time: '12:00',
    location: 'Open Garden',
    image: 'https://images.unsplash.com/photo-1563293750-2a9470a29ef9?q=80&w=2070&auto=format&fit=crop',
    price: '$75.00'
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for data seeding...');

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

    console.log('All dummy data seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
