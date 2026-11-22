require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Banner = require('./models/Banner');
const Blog = require('./models/Blog');
const initialProducts = require('./data/initialProducts');
const initialCategories = require('./data/initialCategories');
const initialBanners = require('./data/initialBanners');
const initialBlogs = require('./data/initialBlogs');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/blogs', blogRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Auto seed all 4 collections if database is empty or needs update
const autoSeedIfEmpty = async () => {
  try {
    // 1. Seed Categories if empty
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.log('[Seed] Categories collection is empty. Seeding categories...');
      await Category.insertMany(initialCategories);
      console.log(`[Seed] Seeded ${initialCategories.length} categories successfully!`);
    } else {
      console.log(`[Database] Found ${categoryCount} existing categories in database.`);
    }

    // 2. Check if products have slug and categoryId, if not or empty, re-seed
    const productCount = await Product.countDocuments();
    const productWithoutSlug = await Product.findOne({ slug: { $exists: false } });

    if (productCount === 0 || productWithoutSlug) {
      console.log('[Seed] Seeding products with slug and categoryId...');
      await Product.deleteMany({});
      await Product.insertMany(initialProducts);
      console.log(`[Seed] Seeded ${initialProducts.length} products with slug and categoryId successfully!`);
    } else {
      console.log(`[Database] Found ${productCount} existing products in database.`);
    }

    // 3. Seed Banners if empty
    const bannerCount = await Banner.countDocuments();
    if (bannerCount === 0) {
      console.log('[Seed] Banners collection is empty. Seeding 3 latest banners...');
      await Banner.insertMany(initialBanners);
      console.log(`[Seed] Seeded ${initialBanners.length} banners successfully!`);
    } else {
      console.log(`[Database] Found ${bannerCount} existing banners in database.`);
    }

    // 4. Seed Blogs if empty
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      console.log('[Seed] Blogs collection is empty. Seeding blogs...');
      await Blog.insertMany(initialBlogs);
      console.log(`[Seed] Seeded ${initialBlogs.length} blogs successfully!`);
    } else {
      console.log(`[Database] Found ${blogCount} existing blogs in database.`);
    }
  } catch (error) {
    console.error('[Seed] Error auto seeding database:', error.message);
  }
};

// Start Server after connecting to MongoDB
connectDB().then(async () => {
  await autoSeedIfEmpty();
  app.listen(PORT, () => {
    console.log(`[Server] Backend running at http://localhost:${PORT}`);
    console.log(`[API] Products: http://localhost:${PORT}/api/products`);
    console.log(`[API] Categories: http://localhost:${PORT}/api/categories`);
    console.log(`[API] Banners: http://localhost:${PORT}/api/banners`);
    console.log(`[API] Blogs: http://localhost:${PORT}/api/blogs`);
  });
});
