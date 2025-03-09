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

// POST endpoint for updating resume data - requires authentication
export async function POST(request: NextRequest) {
  try {
    // Authentication would be implemented here
    // For now, return unauthorized
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Error updating resume data:', error);
    return NextResponse.json(
      { error: 'Failed to update resume data' },
      { status: 500 }
    );
  }
} 