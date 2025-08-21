
'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  Eye, 
  Calendar,
  Activity,
  Layers3,
  Tag,
  FileJson,
  Network,
  ExternalLink
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WorkflowDetail } from '@/lib/types';
import mermaid from 'mermaid';

interface WorkflowDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflowFilename: string | null;
}

export function WorkflowDetailModal({ isOpen, onClose, workflowFilename }: WorkflowDetailModalProps) {
  const [workflow, setWorkflow] = useState<WorkflowDetail | null>(null);
  const [diagramData, setDiagramData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && workflowFilename) {
      fetchWorkflowDetails();
    }
  }, [isOpen, workflowFilename]);

  useEffect(() => {
    if (diagramData && mermaidRef.current && activeTab === 'diagram') {
      renderMermaidDiagram();
    }
  }, [diagramData, activeTab]);

  const fetchWorkflowDetails = async () => {
    if (!workflowFilename) return;
    
    setLoading(true);
    try {
      const [workflowResponse, diagramResponse] = await Promise.all([
        fetch(`/api/workflows/${workflowFilename}`),
        fetch(`/api/workflows/${workflowFilename}/diagram`)
      ]);

      if (workflowResponse.ok) {
        const workflowData = await workflowResponse.json();
        setWorkflow(workflowData);
      }

      if (diagramResponse.ok) {
        const diagramData = await diagramResponse.json();
        setDiagramData(diagramData.diagram);
      }
    } catch (error) {
      console.error('Failed to fetch workflow details:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMermaidDiagram = async () => {
    if (!mermaidRef.current || !diagramData) return;

    try {
      mermaid.initialize({ 
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
          primaryColor: '#60B5FF',
          primaryTextColor: '#fff',
          primaryBorderColor: '#4A90E2',
          lineColor: '#7C3AED',
          secondaryColor: '#FF9149',
          tertiaryColor: '#F1F5F9'
        }
      });

      const { svg } = await mermaid.render('workflow-diagram', diagramData);
      mermaidRef.current.innerHTML = svg;
    } catch (error) {
      console.error('Mermaid rendering failed:', error);
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = '<p class="text-muted-foreground text-center p-4">Failed to render workflow diagram</p>';
      }
    }
  };

  const handleDownload = async () => {
    if (!workflowFilename) return;
    
    try {
      const response = await fetch(`/api/workflows/${workflowFilename}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = workflowFilename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share && workflow) {
      try {
        await navigator.share({
          title: workflow.name,
          text: workflow.description || 'N8N Workflow',
          url: window.location.href
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <Network className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{workflow?.name || 'Loading...'}</h2>
                <p className="text-sm text-muted-foreground">{workflow?.filename}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : workflow ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="diagram">Diagram</TabsTrigger>
              <TabsTrigger value="json">JSON Data</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-4 overflow-auto max-h-[calc(90vh-12rem)]">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Status & Metadata */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Status & Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant={workflow.active ? "default" : "secondary"}>
                        {workflow.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Trigger Type</span>
                      <Badge variant="outline">{workflow.triggerType || 'Unknown'}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Complexity</span>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${
                          workflow.complexity === 'low' ? 'bg-green-500' :
                          workflow.complexity === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <span className="text-sm capitalize">{workflow.complexity}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Node Count</span>
                      <span className="text-sm font-medium">{workflow.nodeCount}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Integrations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Integrations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {workflow.integrations && workflow.integrations.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {workflow.integrations.map((integration, index) => (
                          <Badge key={index} variant="secondary">
                            {integration}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No integrations specified</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Description */}
              {workflow.description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{workflow.description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Tags */}
              {workflow.tags && workflow.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {workflow.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Timestamps */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {workflow.createdAt && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Created</span>
                      <span>{new Date(workflow.createdAt).toLocaleString()}</span>
                    </div>
                  )}
                  {workflow.updatedAt && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Updated</span>
                      <span>{new Date(workflow.updatedAt).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Analyzed</span>
                    <span>{new Date(workflow.analyzedAt).toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="diagram" className="mt-4">
              <Card className="h-[calc(90vh-16rem)]">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Network className="h-4 w-4" />
                    Workflow Diagram
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  <div className="h-full overflow-auto custom-scrollbar">
                    <div ref={mermaidRef} className="min-h-64 flex items-center justify-center">
                      {!diagramData && (
                        <p className="text-muted-foreground">Loading diagram...</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="json" className="mt-4">
              <Card className="h-[calc(90vh-16rem)]">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileJson className="h-4 w-4" />
                    Raw JSON Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  <ScrollArea className="h-full">
                    <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
                      {JSON.stringify(workflow.rawJson, null, 2)}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Failed to load workflow details</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
