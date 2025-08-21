
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { SearchParams, SearchResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const params: SearchParams = {
      q: searchParams.get('q') || undefined,
      trigger: searchParams.get('trigger') || undefined,
      complexity: searchParams.get('complexity') || undefined,
      category: searchParams.get('category') || undefined,
      active_only: searchParams.get('active_only') === 'true',
      page: parseInt(searchParams.get('page') || '1'),
      per_page: Math.min(parseInt(searchParams.get('per_page') || '20'), 100)
    };

    // Build where clause
    const where: any = {};
    
    if (params.active_only) {
      where.active = true;
    }
    
    if (params.trigger && params.trigger !== 'all') {
      where.triggerType = params.trigger;
    }
    
    if (params.complexity && params.complexity !== 'all') {
      where.complexity = params.complexity;
    }

    // Text search in name, description, and integrations
    if (params.q) {
      where.OR = [
        { name: { contains: params.q, mode: 'insensitive' } },
        { description: { contains: params.q, mode: 'insensitive' } },
        { filename: { contains: params.q, mode: 'insensitive' } }
      ];
    }

    // Category filter (needs to be implemented via integrations)
    if (params.category && params.category !== 'all') {
      // Get integrations for this category
      const categoryIntegrations = await prisma.integration.findMany({
        where: { category: params.category },
        select: { name: true }
      });
      
      if (categoryIntegrations.length > 0) {
        const integrationNames = categoryIntegrations.map(i => i.name);
        where.integrations = {
          path: [],
          array_contains: integrationNames
        };
      }
    }

    // Calculate offset
    const offset = (params.page! - 1) * params.per_page!;

    // Execute queries
    const [workflows, total] = await Promise.all([
      prisma.workflow.findMany({
        where,
        select: {
          id: true,
          filename: true,
          name: true,
          workflowId: true,
          active: true,
          description: true,
          triggerType: true,
          complexity: true,
          nodeCount: true,
          integrations: true,
          tags: true,
          createdAt: true,
          updatedAt: true,
          analyzedAt: true
        },
        orderBy: [
          { active: 'desc' },
          { analyzedAt: 'desc' }
        ],
        skip: offset,
        take: params.per_page
      }),
      prisma.workflow.count({ where })
    ]);

    const pages = Math.ceil(total / params.per_page!);

    const response: SearchResponse = {
      workflows: workflows.map(w => ({
        ...w,
        workflowId: w.workflowId || undefined,
        description: w.description || undefined,
        triggerType: w.triggerType || undefined,
        complexity: w.complexity || undefined,
        createdAt: w.createdAt || undefined,
        updatedAt: w.updatedAt || undefined,
        integrations: Array.isArray(w.integrations) ? w.integrations as string[] : [],
        tags: Array.isArray(w.tags) ? w.tags as string[] : []
      })),
      total,
      page: params.page!,
      per_page: params.per_page!,
      pages,
      query: params.q || '',
      filters: {
        trigger: params.trigger,
        complexity: params.complexity,
        category: params.category,
        active_only: params.active_only
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Workflows API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
      { status: 500 }
    );
  }
}
