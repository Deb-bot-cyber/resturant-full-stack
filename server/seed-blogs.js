const mongoose = require('mongoose');
const Blog = require('./models/Blog');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/artisan-feast')
  .then(async () => {
    console.log('MongoDB Connected');
    
    // Clear existing blogs
    await Blog.deleteMany({});
    
    const articles = [
      {
        title: 'Discover the Flavors Behind Our Menu',
        description: 'Explore in-depth analysis, chef tips, and culinary stories to elevate your dining experience',
        image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800'
      },
      {
        title: 'Journey Through Our Culinary Creations',
        description: 'Uncover the inspiration and passion behind our dishes with exclusive insights and recipes',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800'
      },
      {
        title: 'Explore the Stories of Our Signature Dishes',
        description: 'Learn about the ingredients, techniques, and history that make our dishes unforgettable',
        image: 'https://images.unsplash.com/photo-1548943487-a2e4f43b4850?auto=format&fit=crop&q=80&w=800'
      },
      {
        title: 'Savor the Secrets of Our Kitchen',
        description: 'From farm to table, explore the journey of our ingredients and the art of our culinary techniques',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800'
      }
    ];

    await Blog.insertMany(articles);
    console.log('Blogs seeded successfully');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
