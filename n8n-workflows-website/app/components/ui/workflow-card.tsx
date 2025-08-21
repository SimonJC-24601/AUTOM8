
'use client';

import { useState } from 'react';
import { 
  Clock, 
  Activity, 
  Download, 
  Eye, 
  Layers3, 
  Tag,
  Calendar,
  FileJson,
  ExternalLink,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { WorkflowSummary } from '@/lib/types';

interface WorkflowCardProps {
  workflow: WorkflowSummary;
  onViewDetails: (workflow: WorkflowSummary) => void;
}

export function WorkflowCard({ workflow, onViewDetails }: WorkflowCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/workflows/${workflow.filename}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = workflow.filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const getComplexityColor = (complexity?: string) => {
    switch (complexity) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTriggerIcon = (triggerType?: string) => {
    switch (triggerType) {
      case 'Manual': return <Zap className="h-3 w-3" />;
      case 'Webhook': return <ExternalLink className="h-3 w-3" />;
      case 'Scheduled': return <Clock className="h-3 w-3" />;
      case 'Triggered': return <Activity className="h-3 w-3" />;
      default: return <Layers3 className="h-3 w-3" />;
    }
  };

  return (
    <Card className="workflow-card group cursor-pointer h-full" onClick={() => onViewDetails(workflow)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {workflow.active && (
                <div className="h-2 w-2 bg-green-500 rounded-full pulse-active" />
              )}
              <h3 className="font-medium text-sm leading-tight truncate group-hover:text-primary transition-colors">
                {workflow.name}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {workflow.description || 'No description available'}
            </p>
          </div>
          
          <div className="flex items-center gap-1 ml-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              <Download className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(workflow);
              }}
            >
              <Eye className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Workflow Metadata */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              {getTriggerIcon(workflow.triggerType)}
              <span>Trigger</span>
            </div>
            <div className="font-medium">
              {workflow.triggerType || 'Unknown'}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Layers3 className="h-3 w-3" />
              <span>Nodes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{workflow.nodeCount}</span>
              <div className={`h-1.5 w-1.5 rounded-full ${getComplexityColor(workflow.complexity)}`} />
            </div>
          </div>
        </div>

        <Separator />

        {/* Integrations */}
        {workflow.integrations && workflow.integrations.length > 0 && (
          <div>
            <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <Tag className="h-3 w-3" />
              Integrations
            </div>
            <div className="flex flex-wrap gap-1">
              {workflow.integrations.slice(0, 3).map((integration, index) => (
                <Badge key={index} variant="secondary" className="text-xs py-0 px-1.5">
                  {integration}
                </Badge>
              ))}
              {workflow.integrations.length > 3 && (
                <Badge variant="outline" className="text-xs py-0 px-1.5">
                  +{workflow.integrations.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              {workflow.analyzedAt ? new Date(workflow.analyzedAt).toLocaleDateString() : 'Unknown'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FileJson className="h-3 w-3" />
            <span className="truncate max-w-20">
              {workflow.filename.split('_')[0]}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
