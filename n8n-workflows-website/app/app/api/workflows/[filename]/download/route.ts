
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const workflow = await prisma.workflow.findUnique({
      where: { filename: params.filename },
      select: { rawJson: true, name: true }
    });

    if (!workflow || !workflow.rawJson) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    const jsonContent = JSON.stringify(workflow.rawJson, null, 2);
    
    return new NextResponse(jsonContent, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${params.filename}"`,
        'Content-Length': Buffer.byteLength(jsonContent, 'utf8').toString()
      }
    });
  } catch (error) {
    console.error('Workflow download API error:', error);
    return NextResponse.json(
      { error: 'Failed to download workflow' },
      { status: 500 }
    );
  }
}
