import { NextRequest, NextResponse } from 'next/server';
import { getResume } from '@/lib/resume';

export const dynamic = 'force-dynamic';

// GET resume data
export async function GET(request: NextRequest) {
  try {
    const resume = await getResume();
    
    return NextResponse.json(resume);
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