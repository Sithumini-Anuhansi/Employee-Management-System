// Seeds the database with a sample admin account and sample employees.
// Run with: npm run seed  (after setting up your .env file)
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');

const sampleEmployees = [
  { firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@company.com', position: 'Frontend Developer', department: 'Engineering', salary: 75000, status: 'active' },
  { firstName: 'Bilal', lastName: 'Khan', email: 'bilal.khan@company.com', position: 'Backend Developer', department: 'Engineering', salary: 80000, status: 'active' },
  { firstName: 'Chen', lastName: 'Wei', email: 'chen.wei@company.com', position: 'Product Manager', department: 'Product', salary: 95000, status: 'active' },
  { firstName: 'Diana', lastName: 'Perez', email: 'diana.perez@company.com', position: 'UI/UX Designer', department: 'Design', salary: 70000, status: 'on-leave' },
  { firstName: 'Ethan', lastName: 'Brown', email: 'ethan.brown@company.com', position: 'DevOps Engineer', department: 'Engineering', salary: 88000, status: 'active' }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Seed admin (idempotent - won't duplicate if already exists)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@company.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await Admin.create({ email: adminEmail, password: adminPassword });
      console.log(`Admin account created: ${adminEmail} / ${adminPassword}`);
    } else {
      console.log('Admin account already exists, skipping.');
    }

    // Seed employees (clears existing sample data first)
    await Employee.deleteMany({});
    await Employee.insertMany(sampleEmployees);
    console.log(`Seeded ${sampleEmployees.length} sample employees.`);

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
};

seed();
