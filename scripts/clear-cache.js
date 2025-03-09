// Script to clear the Next.js cache
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function clearCache() {
  console.log('Clearing Next.js cache...');
  
  try {
    // Path to the .next directory
    const nextDir = path.join(process.cwd(), '.next');
    
    // Check if .next directory exists
    if (fs.existsSync(nextDir)) {
      console.log('Removing .next directory...');
      fs.rmSync(nextDir, { recursive: true, force: true });
      console.log('.next directory removed successfully.');
    } else {
      console.log('.next directory does not exist.');
    }
    
    // Run next build to regenerate the cache
    console.log('Running next build...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('Next.js cache cleared and rebuilt successfully.');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

clearCache(); 