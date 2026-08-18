import dotenv from 'dotenv';
import mongoose from 'mongoose';

import connectDB from '../config/db.js';
import Ingredient from '../models/Ingredient.js';
import ingredients from './ingredients.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing ingredients...');
    await Ingredient.deleteMany();

    console.log('🌱 Inserting ingredients...');
    const createdIngredients = await Ingredient.insertMany(ingredients);

    console.log(`✅ ${createdIngredients.length} ingredients inserted`);

    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();