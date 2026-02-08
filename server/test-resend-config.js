#!/usr/bin/env node

/**
 * Quick test to verify Resend API key configuration
 * Run with: node test-resend-config.js
 */

console.log('\n🔍 Checking Resend Configuration...\n');

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.error('❌ RESEND_API_KEY is NOT set');
  console.error('\n📋 To fix this:');
  console.error('   1. Go to https://render.com');
  console.error('   2. Find your Vivaha service');
  console.error('   3. Go to Environment');
  console.error('   4. Add variable:');
  console.error('      - Name: RESEND_API_KEY');
  console.error('      - Value: <your-resend-api-key>');
  console.error('   5. Click Save');
  console.error('   6. Service will auto-redeploy\n');
  process.exit(1);
}

console.log('✅ RESEND_API_KEY is SET');
console.log(`   Length: ${apiKey.length} characters`);
console.log(`   Starts: ${apiKey.substring(0, 8)}...`);
console.log(`   Format: ${apiKey.startsWith('re_') ? '✅ Valid Resend format (starts with re_)' : '⚠️  Unknown format'}`);

// Try to import and test Resend
try {
  const { Resend } = require('resend');
  const resend = new Resend(apiKey);
  console.log('\n✅ Resend SDK initialized successfully');
} catch (error) {
  console.error('\n❌ Failed to initialize Resend SDK:', error.message);
  process.exit(1);
}

console.log('\n✅ Configuration looks good!\n');
