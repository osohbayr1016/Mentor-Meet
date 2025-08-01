#!/usr/bin/env node

/**
 * Google Cloud Configuration Verification Script
 * Run this to check if your Google OAuth setup is correct
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Google Cloud Configuration Verification\n');

// Check if .env.local exists
const envPath = path.join(__dirname, 'client', '.env.local');
const envExists = fs.existsSync(envPath);

console.log('📁 Environment Files:');
console.log(`   client/.env.local exists: ${envExists ? '✅' : '❌'}`);

if (envExists) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Check for required variables
  const requiredVars = [
    'NEXTAUTH_URL',
    'GOOGLE_CLIENT_ID', 
    'GOOGLE_CLIENT_SECRET'
  ];
  
  console.log('\n🔧 Environment Variables:');
  requiredVars.forEach(varName => {
    const hasVar = envContent.includes(varName);
    console.log(`   ${varName}: ${hasVar ? '✅' : '❌'}`);
  });
  
  // Check NEXTAUTH_URL port
  const urlMatch = envContent.match(/NEXTAUTH_URL=http:\/\/localhost:(\d+)/);
  if (urlMatch) {
    const port = urlMatch[1];
    console.log(`   Port in NEXTAUTH_URL: ${port} ${port === '3001' ? '✅' : '❌ (should be 3001)'}`);
  }
}

// Check package.json dev script
const packagePath = path.join(__dirname, 'client', 'package.json');
if (fs.existsSync(packagePath)) {
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const devScript = packageContent.scripts?.dev || '';
  const hasPort3001 = devScript.includes('-p 3001');
  
  console.log('\n📦 Package Configuration:');
  console.log(`   Dev script uses port 3001: ${hasPort3001 ? '✅' : '❌'}`);
  console.log(`   Current dev script: "${devScript}"`);
}

console.log('\n🔗 Google Cloud Console Checklist:');
console.log('   [ ] OAuth 2.0 Client ID configured');
console.log('   [ ] Authorized redirect URIs include: http://localhost:3001/api/auth/callback/google');
console.log('   [ ] Authorized JavaScript origins include: http://localhost:3001');
console.log('   [ ] OAuth consent screen has required scopes');
console.log('   [ ] Test users added to OAuth consent screen');

console.log('\n🚀 Next Steps:');
console.log('1. Update Google Cloud Console with correct redirect URI');
console.log('2. Add your email as a test user');
console.log('3. Clear browser cache');
console.log('4. Restart development servers');
console.log('5. Test authentication at http://localhost:3001/auth/signin');

console.log('\n📋 Quick Fix Commands:');
console.log('   cd client && npm run dev  # Start on port 3001');
console.log('   cd server && npm run dev  # Start backend server'); 