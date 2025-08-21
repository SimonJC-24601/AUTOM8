
'use client';

import { useState, useEffect } from 'react';
import { 
  Filter, 
  Tag, 
  Activity, 
  Layers3, 
  Zap,
  Clock,
  Globe,
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { WORKFLOW_CATEGORIES, TRIGGER_TYPES, COMPLEXITY_LEVELS } from '@/lib/types';

interface SidebarProps {
  isOpen: boolean;
  onFilterChange: (filters: any) => void;
  currentFilters: any;
}

export function Sidebar({ isOpen, onFilterChange, currentFilters }: SidebarProps) {
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [triggersOpen, setTriggersOpen] = useState(true);
  const [complexityOpen, setComplexityOpen] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Fetch statistics for sidebar
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        // Silently handle error to prevent console errors
        setStats(null);
      }
    };
    
    fetchStats();
  }, []);

  const handleFilterChange = (type: string, value: string) => {
    const newFilters = { ...currentFilters };
    if (newFilters[type] === value) {
      delete newFilters[type]; // Remove filter if same value clicked
    } else {
      newFilters[type] = value;
    }
    onFilterChange(newFilters);
  };

  const handleActiveToggle = () => {
    const newFilters = { ...currentFilters };
    newFilters.active_only = !newFilters.active_only;
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  if (!isOpen) return null;

  return (
    <aside className="w-80 h-full border-r border-border bg-card/50 flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </h2>
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear All
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          {/* Quick Stats */}
          {stats && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Workflows</span>
                  <Badge variant="secondary" className="count-up">{stats.total}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active</span>
                  <Badge variant="default" className="count-up pulse-active">{stats.active}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Integrations</span>
                  <Badge variant="outline" className="count-up">{stats.unique_integrations}</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Status
            </h3>
            <Button
              variant={currentFilters.active_only ? "default" : "outline"}
              size="sm"
              onClick={handleActiveToggle}
              className="w-full justify-start"
            >
              <Activity className="h-4 w-4 mr-2" />
              Active Only
              {currentFilters.active_only && (
                <Badge variant="secondary" className="ml-auto">
                  {stats?.active || 0}
                </Badge>
              )}
            </Button>
          </div>

          <Separator />

          {/* Categories */}
          <Collapsible open={categoriesOpen} onOpenChange={setCategoriesOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium hover:text-primary">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Categories
              </div>
              {categoriesOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-3">
              {WORKFLOW_CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={currentFilters.category === category ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleFilterChange('category', category)}
                  className="w-full justify-start text-xs"
                >
                  {category}
                </Button>
              ))}
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Trigger Types */}
          <Collapsible open={triggersOpen} onOpenChange={setTriggersOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium hover:text-primary">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Trigger Types
              </div>
              {triggersOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-3">
              {TRIGGER_TYPES.map((trigger) => (
                <Button
                  key={trigger}
                  variant={currentFilters.trigger === trigger ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleFilterChange('trigger', trigger)}
                  className="w-full justify-start"
                >
                  <div className="flex items-center gap-2">
                    {trigger === 'Manual' && <Settings className="h-3 w-3" />}
                    {trigger === 'Webhook' && <Globe className="h-3 w-3" />}
                    {trigger === 'Scheduled' && <Clock className="h-3 w-3" />}
                    {trigger === 'Triggered' && <Zap className="h-3 w-3" />}
                    {trigger}
                  </div>
                  {stats?.triggers?.[trigger] && (
                    <Badge variant="secondary" className="ml-auto">
                      {stats.triggers[trigger]}
                    </Badge>
                  )}
                </Button>
              ))}
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Complexity */}
          <Collapsible open={complexityOpen} onOpenChange={setComplexityOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium hover:text-primary">
              <div className="flex items-center gap-2">
                <Layers3 className="h-4 w-4" />
                Complexity
              </div>
              {complexityOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-3">
              {COMPLEXITY_LEVELS.map((complexity) => (
                <Button
                  key={complexity}
                  variant={currentFilters.complexity === complexity ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleFilterChange('complexity', complexity)}
                  className="w-full justify-start capitalize"
                >
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${
                      complexity === 'low' ? 'bg-green-500' :
                      complexity === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    {complexity}
                  </div>
                  {stats?.complexity?.[complexity] && (
                    <Badge variant="secondary" className="ml-auto">
                      {stats.complexity[complexity]}
                    </Badge>
                  )}
                </Button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </aside>
  );
}
