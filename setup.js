#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up EduGuide project...\n');

// Check if Node.js is installed
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  console.log(`✅ Node.js ${nodeVersion} detected`);
} catch (error) {
  console.error('❌ Node.js is not installed. Please install Node.js 16+ first.');
  process.exit(1);
}

// Create .env files if they don't exist
const backendEnvPath = path.join(__dirname, 'backend', '.env');
const frontendEnvPath = path.join(__dirname, 'frontend', '.env');

if (!fs.existsSync(backendEnvPath)) {
  const backendEnvContent = `PORT=5000
MONGO_URI=mongodb://localhost:27017/eduguide
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development`;
  fs.writeFileSync(backendEnvPath, backendEnvContent);
  console.log('✅ Created backend/.env file');
}

if (!fs.existsSync(frontendEnvPath)) {
  const frontendEnvContent = `VITE_API_URL=http://localhost:5000/api`;
  fs.writeFileSync(frontendEnvPath, frontendEnvContent);
  console.log('✅ Created frontend/.env file');
}

// Install backend dependencies
console.log('\n📦 Installing backend dependencies...');
try {
  execSync('npm install', { cwd: path.join(__dirname, 'backend'), stdio: 'inherit' });
  console.log('✅ Backend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install backend dependencies');
  process.exit(1);
}

// Install frontend dependencies
console.log('\n📦 Installing frontend dependencies...');
try {
  execSync('npm install', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies');
  process.exit(1);
}

// Seed the database
console.log('\n🌱 Seeding database...');
try {
  execSync('npm run seed', { cwd: path.join(__dirname, 'backend'), stdio: 'inherit' });
  console.log('✅ Database seeded successfully');
} catch (error) {
  console.error('❌ Failed to seed database. Make sure MongoDB is running.');
  console.log('💡 To start MongoDB:');
  console.log('   - Windows: Start MongoDB service or run "mongod"');
  console.log('   - macOS: brew services start mongodb-community');
  console.log('   - Linux: sudo systemctl start mongod');
}

console.log('\n🎉 Setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Make sure MongoDB is running');
console.log('2. Start the backend: cd backend && npm run dev');
console.log('3. Start the frontend: cd frontend && npm run dev');
console.log('4. Open http://localhost:5173 in your browser');
console.log('\n🔧 Configuration:');
console.log('- Backend runs on http://localhost:5000');
console.log('- Frontend runs on http://localhost:5173');
console.log('- Database: MongoDB on localhost:27017');
console.log('\n📚 For more information, check the README.md file');
