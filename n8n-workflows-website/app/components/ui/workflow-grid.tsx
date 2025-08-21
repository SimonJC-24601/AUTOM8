
'use client';

import { useState, useEffect } from 'react';
import { SearchIcon, Loader2 } from 'lucide-react';
import { WorkflowCard } from './workflow-card';
import { WorkflowDetailModal } from './workflow-detail';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WorkflowSummary, SearchResponse } from '@/lib/types';

interface WorkflowGridProps {
  searchQuery: string;
  filters: any;
}

export function WorkflowGrid({ searchQuery, filters }: WorkflowGridProps) {
  const [workflows, setWorkflows] = useState<WorkflowSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 20,
    total: 0,
    pages: 0
  });
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchWorkflows(1, true);
  }, [searchQuery, filters]);

  const fetchWorkflows = async (page: number = 1, reset: boolean = false) => {
    if (reset) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: pagination.per_page.toString(),
        ...(searchQuery && { q: searchQuery }),
        ...filters
      });

      const response = await fetch(`/api/workflows?${params}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch workflows: ${response.status}`);
      }

      const data: SearchResponse = await response.json();
      
      if (reset) {
        setWorkflows(data.workflows);
      } else {
        setWorkflows(prev => [...prev, ...data.workflows]);
      }
      
      setPagination({
        page: data.page,
        per_page: data.per_page,
        total: data.total,
        pages: data.pages
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.pages) {
      fetchWorkflows(pagination.page + 1, false);
    }
  };

  const handleViewDetails = (workflow: WorkflowSummary) => {
    setSelectedWorkflow(workflow.filename);
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground mb-4">
            <SearchIcon className="h-12 w-12 mx-auto mb-2" />
            <p>Failed to load workflows</p>
            <p className="text-sm">{error}</p>
          </div>
          <Button onClick={() => fetchWorkflows(1, true)}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (workflows.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">
            <SearchIcon className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No workflows found</h3>
            <p className="text-sm">
              {searchQuery || Object.keys(filters).length > 0
                ? 'Try adjusting your search or filters'
                : 'No workflows available in the database'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {workflows.length} of {pagination.total.toLocaleString()} workflows
            {searchQuery && (
              <span> for "{searchQuery}"</span>
            )}
          </div>
          {Object.keys(filters).length > 0 && (
            <div className="text-xs text-muted-foreground">
              {Object.keys(filters).length} filter{Object.keys(filters).length > 1 ? 's' : ''} active
            </div>
          )}
        </div>

        {/* Workflow Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {workflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {/* Load More Button */}
        {pagination.page < pagination.pages && (
          <div className="text-center">
            <Button
              onClick={handleLoadMore}
              disabled={loadingMore}
              variant="outline"
              size="lg"
            >
              {loadingMore && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Load More Workflows
            </Button>
          </div>
        )}
      </div>

      {/* Workflow Detail Modal */}
      <WorkflowDetailModal
        isOpen={!!selectedWorkflow}
        onClose={() => setSelectedWorkflow(null)}
        workflowFilename={selectedWorkflow}
      />
    </>
  );
}
