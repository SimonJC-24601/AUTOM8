
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/ui/header';
import { Sidebar } from '@/components/ui/sidebar';
import { WorkflowGrid } from '@/components/ui/workflow-grid';
import { StatsDashboard } from '@/components/ui/stats-dashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3, 
  Search, 
  Sparkles, 
  Zap, 
  TrendingUp,
  ArrowRight,
  Grid3x3,
  Filter
} from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<any>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<'overview' | 'workflows' | 'stats'>('overview');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Fetch initial stats
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (currentView === 'overview') {
      setCurrentView('workflows');
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    if (currentView === 'overview') {
      setCurrentView('workflows');
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-cyan-950/20 p-8 md:p-12">
        <div className="absolute inset-0 tech-pattern opacity-30"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                N8N Workflows Directory
              </h1>
              <p className="text-lg text-muted-foreground">Powered by LifejacketAI</p>
            </div>
          </div>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed">
            Discover and explore comprehensive automation workflows designed for modern business operations, 
            AI integration, and process optimization.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              onClick={() => setCurrentView('workflows')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Search className="h-4 w-4 mr-2" />
              Explore Workflows
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setCurrentView('stats')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      {stats && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Workflows</p>
                  <p className="text-2xl font-bold count-up">{stats.total?.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Grid3x3 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Workflows</p>
                  <p className="text-2xl font-bold count-up text-green-600">{stats.active}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Integrations</p>
                  <p className="text-2xl font-bold count-up">{stats.unique_integrations}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Nodes</p>
                  <p className="text-2xl font-bold count-up">{stats.total_nodes?.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Popular Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Popular Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[
              'AI Agent Development',
              'Communication & Messaging', 
              'Data Processing & Analysis',
              'Business Process Automation',
              'Cloud Storage & File Management',
              'Social Media Management'
            ].map((category) => (
              <Button
                key={category}
                variant="ghost"
                className="h-auto p-4 justify-start text-left"
                onClick={() => {
                  setFilters({ category });
                  setCurrentView('workflows');
                }}
              >
                <div>
                  <p className="font-medium">{category}</p>
                  <p className="text-xs text-muted-foreground">
                    View workflows in this category
                  </p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feature Highlights */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-dashed hover:border-solid transition-all">
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Advanced Search</h3>
            <p className="text-sm text-muted-foreground">
              Powerful full-text search with Boolean operators and intelligent filtering
            </p>
          </CardContent>
        </Card>

        <Card className="border-dashed hover:border-solid transition-all">
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mx-auto mb-4">
              <Grid3x3 className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Visual Diagrams</h3>
            <p className="text-sm text-muted-foreground">
              Interactive Mermaid diagrams showing workflow structure and connections
            </p>
          </CardContent>
        </Card>

        <Card className="border-dashed hover:border-solid transition-all">
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Rich Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive statistics and insights about workflow usage patterns
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'workflows':
        return <WorkflowGrid searchQuery={searchQuery} filters={filters} />;
      case 'stats':
        return <StatsDashboard />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSearch={handleSearch}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      
      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
          <Sidebar 
            isOpen={sidebarOpen}
            onFilterChange={handleFilterChange}
            currentFilters={filters}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 container max-w-screen-2xl mx-auto p-6 lg:p-8">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant={currentView === 'overview' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('overview')}
            >
              Overview
            </Button>
            <Button
              variant={currentView === 'workflows' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('workflows')}
            >
              Workflows
            </Button>
            <Button
              variant={currentView === 'stats' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('stats')}
            >
              Analytics
            </Button>
            
            {/* Active Filters Indicator */}
            {Object.keys(filters).length > 0 && (
              <>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Filters:</span>
                  {Object.entries(filters).map(([key, value]) => (
                    <Badge key={key} variant="secondary" className="text-xs">
                      {key}: {String(value)}
                    </Badge>
                  ))}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setFilters({})}
                    className="text-xs"
                  >
                    Clear
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Content */}
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
