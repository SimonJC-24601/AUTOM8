
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { StatsResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [
      total,
      active,
      triggerStats,
      complexityStats,
      totalNodes,
      uniqueIntegrations,
      lastWorkflow
    ] = await Promise.all([
      prisma.workflow.count(),
      prisma.workflow.count({ where: { active: true } }),
      prisma.workflow.groupBy({
        by: ['triggerType'],
        _count: { triggerType: true },
        where: { triggerType: { not: null } }
      }),
      prisma.workflow.groupBy({
        by: ['complexity'],
        _count: { complexity: true },
        where: { complexity: { not: null } }
      }),
      prisma.workflow.aggregate({
        _sum: { nodeCount: true }
      }),
      prisma.integration.count(),
      prisma.workflow.findFirst({
        orderBy: { analyzedAt: 'desc' },
        select: { analyzedAt: true }
      })
    ]);

    const triggers: Record<string, number> = {};
    triggerStats.forEach(stat => {
      if (stat.triggerType) {
        triggers[stat.triggerType] = stat._count.triggerType;
      }
    });

    const complexity: Record<string, number> = {};
    complexityStats.forEach(stat => {
      if (stat.complexity) {
        complexity[stat.complexity] = stat._count.complexity;
      }
    });

    const stats: StatsResponse = {
      total,
      active,
      inactive: total - active,
      triggers,
      complexity,
      total_nodes: totalNodes._sum.nodeCount || 0,
      unique_integrations: uniqueIntegrations,
      last_indexed: lastWorkflow?.analyzedAt?.toISOString() || new Date().toISOString()
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
