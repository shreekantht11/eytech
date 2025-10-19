import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Customer from '../src/models/Customer';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedCustomers = [
  {
    customerId: 'CUST001',
    name: 'Rajesh Kumar',
    age: 35,
    city: 'Mumbai',
    phone: '9876543210',
    gst: 'GST123456',
    currentLoan: 0,
    creditScore: 780,
    preApprovedLimit: 50000,
    salary: 45000,
  },
  {
    customerId: 'CUST002',
    name: 'Priya Sharma',
    age: 29,
    city: 'Delhi',
    phone: '9876543211',
    gst: 'GST123457',
    currentLoan: 25000,
    creditScore: 820,
    preApprovedLimit: 75000,
    salary: 60000,
  },
  {
    customerId: 'CUST003',
    name: 'Amit Patel',
    age: 42,
    city: 'Bangalore',
    phone: '9876543212',
    currentLoan: 0,
    creditScore: 650,
    preApprovedLimit: 30000,
    salary: 35000,
  },
  {
    customerId: 'CUST004',
    name: 'Sneha Reddy',
    age: 31,
    city: 'Hyderabad',
    phone: '9876543213',
    gst: 'GST123458',
    currentLoan: 15000,
    creditScore: 750,
    preApprovedLimit: 100000,
    salary: 80000,
  },
  {
    customerId: 'CUST005',
    name: 'Vikram Singh',
    age: 38,
    city: 'Pune',
    phone: '9876543214',
    currentLoan: 0,
    creditScore: 720,
    preApprovedLimit: 60000,
    salary: 50000,
  },
  {
    customerId: 'CUST006',
    name: 'Ananya Gupta',
    age: 27,
    city: 'Chennai',
    phone: '9876543215',
    currentLoan: 10000,
    creditScore: 800,
    preApprovedLimit: 90000,
    salary: 70000,
  },
  {
    customerId: 'CUST007',
    name: 'Rohan Mehta',
    age: 45,
    city: 'Ahmedabad',
    phone: '9876543216',
    gst: 'GST123459',
    currentLoan: 50000,
    creditScore: 690,
    preApprovedLimit: 40000,
    salary: 42000,
  },
  {
    customerId: 'CUST008',
    name: 'Kavita Joshi',
    age: 33,
    city: 'Kolkata',
    phone: '9876543217',
    currentLoan: 0,
    creditScore: 760,
    preApprovedLimit: 80000,
    salary: 65000,
  },
  {
    customerId: 'CUST009',
    name: 'Arjun Nair',
    age: 40,
    city: 'Kochi',
    phone: '9876543218',
    gst: 'GST123460',
    currentLoan: 30000,
    creditScore: 710,
    preApprovedLimit: 55000,
    salary: 48000,
  },
  {
    customerId: 'CUST010',
    name: 'Meera Iyer',
    age: 36,
    city: 'Jaipur',
    phone: '9876543219',
    currentLoan: 0,
    creditScore: 840,
    preApprovedLimit: 120000,
    salary: 95000,
  },
];

async function seed() {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('❌ MONGODB_URI is not defined in .env file');
      process.exit(1);
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Clear existing customers
    console.log('🗑️  Clearing existing customer data...');
    await Customer.deleteMany({});

    // Insert seed data
    console.log('🌱 Seeding customer data...');
    await Customer.insertMany(seedCustomers);

    console.log(`✅ Successfully seeded ${seedCustomers.length} customers`);
    console.log('\n📊 Customer Summary:');
    console.log('━'.repeat(80));
    
    seedCustomers.forEach(customer => {
      console.log(`${customer.name.padEnd(20)} | Phone: ${customer.phone} | Score: ${customer.creditScore} | Limit: ₹${customer.preApprovedLimit.toLocaleString('en-IN')}`);
    });
    
    console.log('━'.repeat(80));
    console.log('\n✨ Database seeding completed successfully!');
    console.log('\n💡 Test Scenarios:');
    console.log('  Flow A (Instant Approve): Use phone 9876543210 (Pre-approved: ₹50,000)');
    console.log('  Flow B (Salary Required): Use phone 9876543211 (Pre-approved: ₹75,000)');
    console.log('  Flow C (Rejection): Use phone 9876543212 (Credit Score: 650)\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seed();
