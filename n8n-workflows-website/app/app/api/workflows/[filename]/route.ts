
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const workflow = await prisma.workflow.findUnique({
      where: { filename: params.filename }
    });

    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    // Convert to WorkflowDetail format
    const workflowDetail = {
      ...workflow,
      workflowId: workflow.workflowId || undefined,
      description: workflow.description || undefined,
      triggerType: workflow.triggerType || undefined,
      complexity: workflow.complexity || undefined,
      createdAt: workflow.createdAt || undefined,
      updatedAt: workflow.updatedAt || undefined,
      integrations: Array.isArray(workflow.integrations) ? workflow.integrations as string[] : [],
      tags: Array.isArray(workflow.tags) ? workflow.tags as string[] : [],
      rawJson: workflow.rawJson
    };

    return NextResponse.json(workflowDetail);
  } catch (error) {
    console.error('Workflow detail API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workflow details' },
      { status: 500 }
    );
  }
}
