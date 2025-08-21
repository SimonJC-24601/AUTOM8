
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const integrations = await prisma.integration.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        category: true,
        description: true
      }
    });

    // Group by category
    const groupedByCategory = integrations.reduce((acc, integration) => {
      if (!acc[integration.category]) {
        acc[integration.category] = [];
      }
      acc[integration.category].push(integration);
      return acc;
    }, {} as Record<string, typeof integrations>);

    return NextResponse.json({
      integrations,
      grouped: groupedByCategory,
      total: integrations.length
    });
  } catch (error) {
    console.error('Integrations API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch integrations' },
      { status: 500 }
    );
  }
}
