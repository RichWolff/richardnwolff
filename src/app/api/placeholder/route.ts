import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const width = parseInt(searchParams.get('width') || '1200', 10);
  const height = parseInt(searchParams.get('height') || '630', 10);
  const text = searchParams.get('text') || 'Blog Image';
  const bgColor = searchParams.get('bg') || '3b82f6'; // Default blue color
  
  // Create SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#${bgColor}"/>
      <text 
        x="50%" 
        y="50%" 
        font-family="system-ui, sans-serif" 
        font-size="${Math.floor(width / 20)}px" 
        font-weight="bold" 
        fill="white" 
        text-anchor="middle" 
        dominant-baseline="middle"
      >
        ${text}
      </text>
    </svg>
  `;
  
  // Convert SVG to buffer
  const svgBuffer = Buffer.from(svg);
  
  // Return SVG as response
  return new NextResponse(svgBuffer, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}

export const dynamic = 'force-dynamic'; 