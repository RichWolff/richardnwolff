const fs = require('fs');
const path = require('path');

// Create blog images directory if it doesn't exist
const blogImagesDir = path.join(process.cwd(), 'public', 'images', 'blog');
if (!fs.existsSync(blogImagesDir)) {
  fs.mkdirSync(blogImagesDir, { recursive: true });
  console.log('Created blog images directory');
}

// Sample image configurations
const images = [
  {
    name: 'mdx-images.svg',
    width: 1200,
    height: 630,
    text: 'MDX Images Tutorial',
    bg: '3b82f6' // blue
  },
  {
    name: 'landscape.svg',
    width: 1200,
    height: 800,
    text: 'Beautiful Landscape',
    bg: '10b981' // green
  },
  {
    name: 'small-example.svg',
    width: 600,
    height: 400,
    text: 'Small Image Example',
    bg: '8b5cf6' // purple
  },
  {
    name: 'medium-example.svg',
    width: 800,
    height: 500,
    text: 'Medium Image Example',
    bg: 'f59e0b' // amber
  },
  {
    name: 'large-example.svg',
    width: 1200,
    height: 600,
    text: 'Large Image Example',
    bg: 'ef4444' // red
  },
  {
    name: 'full-example.svg',
    width: 1600,
    height: 800,
    text: 'Full Width Image Example',
    bg: '6366f1' // indigo
  },
  {
    name: 'sunset.svg',
    width: 1200,
    height: 675,
    text: 'Sunset Over Mountains',
    bg: 'f97316' // orange
  },
  {
    name: 'city-night.svg',
    width: 1200,
    height: 675,
    text: 'City Skyline at Night',
    bg: '0f172a' // slate-900
  },
  {
    name: 'placeholder.svg',
    width: 1200,
    height: 630,
    text: 'Blog Post Image',
    bg: '64748b' // slate-500
  }
];

// Function to create an SVG placeholder
function createSvgPlaceholder(config) {
  const svg = `<svg width="${config.width}" height="${config.height}" xmlns="http://www.w3.org/2000/svg">
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
</svg>`;
  
  const filePath = path.join(blogImagesDir, config.name);
  fs.writeFileSync(filePath, svg);
  console.log(`Created ${config.name}`);
}

// Generate all images
function generateImages() {
  console.log('Generating SVG placeholder images...');
  
  for (const image of images) {
    createSvgPlaceholder(image);
  }
  
  console.log('All SVG placeholder images generated successfully!');
}

generateImages(); 