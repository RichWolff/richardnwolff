import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const resumeFilePath = path.join(process.cwd(), 'content/resume.json');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to verify JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
  } catch (error) {
    return null;
  }
}

// Initialize resume file if it doesn't exist
function initResumeFile() {
  if (!fs.existsSync(resumeFilePath)) {
    const initialData = {
      experience: [],
      education: [],
      skills: [],
      certifications: []
    };
    fs.writeFileSync(resumeFilePath, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  
  return JSON.parse(fs.readFileSync(resumeFilePath, 'utf8'));
}

// GET resume data
export async function GET() {
  try {
    // Initialize resume file if it doesn't exist
    const resumeData = initResumeFile();
    
    return NextResponse.json(resumeData);
  } catch (error) {
    console.error('Error fetching resume data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume data' },
      { status: 500 }
    );
  }
}

// POST to add a new resume item
export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { section, item } = await request.json();
    
    // Validate input
    if (!section || !item) {
      return NextResponse.json(
        { error: 'Section and item data are required' },
        { status: 400 }
      );
    }
    
    // Valid sections
    const validSections = ['experience', 'education', 'skills', 'certifications'];
    if (!validSections.includes(section)) {
      return NextResponse.json(
        { error: 'Invalid section' },
        { status: 400 }
      );
    }
    
    // Get current resume data
    const resumeData = initResumeFile();
    
    // Add new item with ID
    const newItem = {
      id: Date.now().toString(),
      ...item,
      dateAdded: new Date().toISOString()
    };
    
    resumeData[section].push(newItem);
    
    // Save updated data
    fs.writeFileSync(resumeFilePath, JSON.stringify(resumeData, null, 2));
    
    return NextResponse.json({
      success: true,
      item: newItem
    });
  } catch (error) {
    console.error('Error adding resume item:', error);
    return NextResponse.json(
      { error: 'Failed to add resume item' },
      { status: 500 }
    );
  }
} 