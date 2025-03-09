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

// Helper function to get resume data
function getResumeData() {
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

// PUT to update a resume item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
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
    const resumeData = getResumeData();
    
    // Find the item to update
    const sectionData = resumeData[section];
    const itemIndex = sectionData.findIndex((i: any) => i.id === id);
    
    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }
    
    // Update the item
    const updatedItem = {
      ...sectionData[itemIndex],
      ...item,
      id, // Preserve the original ID
      dateUpdated: new Date().toISOString()
    };
    
    resumeData[section][itemIndex] = updatedItem;
    
    // Save updated data
    fs.writeFileSync(resumeFilePath, JSON.stringify(resumeData, null, 2));
    
    return NextResponse.json({
      success: true,
      item: updatedItem
    });
  } catch (error) {
    console.error('Error updating resume item:', error);
    return NextResponse.json(
      { error: 'Failed to update resume item' },
      { status: 500 }
    );
  }
}

// DELETE a resume item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    const sectionQuery = request.nextUrl.searchParams.get('section');
    
    if (!sectionQuery) {
      return NextResponse.json(
        { error: 'Section parameter is required' },
        { status: 400 }
      );
    }
    
    // Valid sections
    const validSections = ['experience', 'education', 'skills', 'certifications'];
    if (!validSections.includes(sectionQuery)) {
      return NextResponse.json(
        { error: 'Invalid section' },
        { status: 400 }
      );
    }
    
    // Get current resume data
    const resumeData = getResumeData();
    
    // Find the item to delete
    const sectionData = resumeData[sectionQuery];
    const itemIndex = sectionData.findIndex((i: any) => i.id === id);
    
    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }
    
    // Remove the item
    resumeData[sectionQuery].splice(itemIndex, 1);
    
    // Save updated data
    fs.writeFileSync(resumeFilePath, JSON.stringify(resumeData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting resume item:', error);
    return NextResponse.json(
      { error: 'Failed to delete resume item' },
      { status: 500 }
    );
  }
} 