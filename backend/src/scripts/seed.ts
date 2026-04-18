import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from backend/.env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const defaultUsers = [
  { id: 'u1', email: 'admin@skillaunch.com', password: 'admin123', role: 'admin', name: 'Admin' },
  { id: 'u2', email: 'mentor@skillaunch.com', password: 'mentor123', role: 'mentor', name: 'Alex Mentor' },
  { id: 'u3', email: 'student1@skillaunch.com', password: 'student123', role: 'student', name: 'Riya Singh' },
  { id: 'u4', email: 'student2@skillaunch.com', password: 'student123', role: 'student', name: 'Karan Joshi' },
  { id: 'u5', email: 'student3@skillaunch.com', password: 'student123', role: 'student', name: 'Meera Das' },
];

async function seedDatabase() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    for (const userData of defaultUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`User ${userData.email} already exists. Skipping.`);
        continue;
      }

      console.log(`Creating user: ${userData.email} (${userData.role})`);
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const newUser = new User({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role
      });

      await newUser.save();
      console.log(`User ${userData.email} created.`);
    }

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
