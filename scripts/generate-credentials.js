#!/usr/bin/env node

/**
 * This script generates hashed credentials for use in the AuthContext.tsx file.
 * Run it with: node scripts/generate-credentials.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// Get credentials from .env.local
const email = process.env.ADMIN_EMAIL || 'your-email@example.com';
const password = process.env.ADMIN_PASSWORD || 'your-secure-password';

// Generate SHA-256 hashes
const emailHash = crypto.createHash('sha256').update(email).digest('hex');
const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

console.log('\n=== Hashed Credentials for AuthContext.tsx ===\n');
console.log(`Email: ${email}`);
console.log(`Email Hash: ${emailHash}`);
console.log('\n');
console.log(`Password: ${password}`);
console.log(`Password Hash: ${passwordHash}`);
console.log('\n');
console.log('Replace the values in src/context/AuthContext.tsx with these hashes:');
console.log('\n');
console.log(`const ADMIN_EMAIL_HASH = '${emailHash}';`);
console.log(`const ADMIN_PASSWORD_HASH = '${passwordHash}';`);
console.log('\n');
console.log('=== End of Hashed Credentials ===\n');

// Optionally, update the AuthContext.tsx file automatically
const authContextPath = path.resolve(process.cwd(), 'src/context/AuthContext.tsx');
if (fs.existsSync(authContextPath)) {
  let authContextContent = fs.readFileSync(authContextPath, 'utf8');
  
  // Replace the email hash
  authContextContent = authContextContent.replace(
    /const ADMIN_EMAIL_HASH = .*?;/,
    `const ADMIN_EMAIL_HASH = '${emailHash}';`
  );
  
  // Replace the password hash
  authContextContent = authContextContent.replace(
    /const ADMIN_PASSWORD_HASH = .*?;/,
    `const ADMIN_PASSWORD_HASH = '${passwordHash}';`
  );
  
  // Replace the secret key
  authContextContent = authContextContent.replace(
    /const SECRET_KEY = .*?;/,
    `const SECRET_KEY = '${process.env.SECRET_KEY || 'your-secret-key'}';`
  );
  
  // Write the updated content back to the file
  fs.writeFileSync(authContextPath, authContextContent);
  console.log('AuthContext.tsx has been updated with the new hashed credentials.');
} 