
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { N8NWorkflow } from '@/lib/types';

export const dynamic = 'force-dynamic';

function generateMermaidDiagram(workflow: N8NWorkflow): string {
  const { nodes, connections } = workflow;
  
  let mermaid = 'graph TD\n';
  
  // Add nodes
  nodes.forEach(node => {
    const nodeId = node.id.replace(/[^a-zA-Z0-9]/g, '_');
    const nodeLabel = node.name.replace(/"/g, '\\"');
    const nodeType = node.type.split('.').pop() || 'node';
    
    // Style nodes based on type
    if (nodeType.includes('trigger') || nodeType.includes('manual')) {
      mermaid += `  ${nodeId}["🚀 ${nodeLabel}"]\n`;
    } else if (nodeType.includes('http') || nodeType.includes('webhook')) {
      mermaid += `  ${nodeId}["🌐 ${nodeLabel}"]\n`;
    } else if (nodeType.includes('database') || nodeType.includes('sql')) {
      mermaid += `  ${nodeId}["🗄️ ${nodeLabel}"]\n`;
    } else if (nodeType.includes('email') || nodeType.includes('telegram') || nodeType.includes('slack')) {
      mermaid += `  ${nodeId}["💬 ${nodeLabel}"]\n`;
    } else {
      mermaid += `  ${nodeId}["⚙️ ${nodeLabel}"]\n`;
    }
  });
  
  // Add connections
  Object.entries(connections).forEach(([sourceNodeName, connectionData]) => {
    const sourceId = nodes.find(n => n.name === sourceNodeName)?.id?.replace(/[^a-zA-Z0-9]/g, '_');
    
    if (sourceId && connectionData.main) {
      connectionData.main.forEach(connectionArray => {
        connectionArray.forEach(connection => {
          const targetId = nodes.find(n => n.name === connection.node)?.id?.replace(/[^a-zA-Z0-9]/g, '_');
          if (targetId) {
            mermaid += `  ${sourceId} --> ${targetId}\n`;
          }
        });
      });
    }
  });
  
  // Add styling
  mermaid += '\n  classDef default fill:#f9f9f9,stroke:#333,stroke-width:2px;\n';
  
  return mermaid;
}

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

    const mermaidDiagram = generateMermaidDiagram(workflow.rawJson as unknown as N8NWorkflow);
    
    return NextResponse.json({
      diagram: mermaidDiagram,
      workflowName: workflow.name
    });
  } catch (error) {
    console.error('Workflow diagram API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate workflow diagram' },
      { status: 500 }
    );
  }
}
