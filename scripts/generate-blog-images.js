const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Create blog images directory if it doesn't exist
const blogImagesDir = path.join(process.cwd(), 'public', 'images', 'blog');
if (!fs.existsSync(blogImagesDir)) {
  fs.mkdirSync(blogImagesDir, { recursive: true });
  console.log('Created blog images directory');
}

// Sample image configurations
const images = [
  {
    name: 'mdx-images.jpg',
    width: 1200,
    height: 630,
    text: 'MDX Images Tutorial',
    bg: '3b82f6' // blue
  },
  {
    name: 'landscape.jpg',
    width: 1200,
    height: 800,
    text: 'Beautiful Landscape',
    bg: '10b981' // green
  },
  {
    name: 'small-example.jpg',
    width: 600,
    height: 400,
    text: 'Small Image Example',
    bg: '8b5cf6' // purple
  },
  {
    name: 'medium-example.jpg',
    width: 800,
    height: 500,
    text: 'Medium Image Example',
    bg: 'f59e0b' // amber
  },
  {
    name: 'large-example.jpg',
    width: 1200,
    height: 600,
    text: 'Large Image Example',
    bg: 'ef4444' // red
  },
  {
    name: 'full-example.jpg',
    width: 1600,
    height: 800,
    text: 'Full Width Image Example',
    bg: '6366f1' // indigo
  },
  {
    name: 'sunset.jpg',
    width: 1200,
    height: 675,
    text: 'Sunset Over Mountains',
    bg: 'f97316' // orange
  },
  {
    name: 'city-night.jpg',
    width: 1200,
    height: 675,
    text: 'City Skyline at Night',
    bg: '0f172a' // slate-900
  }
];

// Function to download an image from the placeholder API
function downloadImage(config) {
  return new Promise((resolve, reject) => {
    const url = `http://localhost:3000/api/placeholder?width=${config.width}&height=${config.height}&text=${encodeURIComponent(config.text)}&bg=${config.bg}`;
    const filePath = path.join(blogImagesDir, config.name);
    
    // For simplicity, we'll create a colored rectangle with text using ImageMagick
    // This avoids having to start the Next.js server to use the API
    try {
      const command = `convert -size ${config.width}x${config.height} xc:#${config.bg} -gravity center -pointsize ${Math.floor(config.width / 20)} -fill white -font Arial -annotate 0 "${config.text}" ${filePath}`;
      execSync(command);
      console.log(`Created ${config.name}`);
      resolve();
    } catch (error) {
      console.error(`Error creating ${config.name}: ${error.message}`);
      console.log('Falling back to creating a simple SVG file...');
      
      // Fallback to creating an SVG file directly
      const svg = `
        <svg width="${config.width}" height="${config.height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#${config.bg}"/>
          <text 
            x="50%" 
            y="50%" 
            font-family="Arial, sans-serif" 
            font-size="${Math.floor(config.width / 20)}px" 
            font-weight="bold" 
            fill="white" 
            text-anchor="middle" 
            dominant-baseline="middle"
          >
            ${config.text}
          </text>
        </svg>
      `;
      
      try {
        fs.writeFileSync(filePath.replace('.jpg', '.svg'), svg);
        console.log(`Created ${config.name.replace('.jpg', '.svg')} (SVG fallback)`);
        resolve();
      } catch (svgError) {
        console.error(`Error creating SVG fallback: ${svgError.message}`);
        reject(svgError);
      }
    }
  });
}

// Generate all images
async function generateImages() {
  console.log('Generating blog images...');
  
  for (const image of images) {
    await downloadImage(image);
  }
  
  console.log('All blog images generated successfully!');
}

generateImages().catch(console.error); 