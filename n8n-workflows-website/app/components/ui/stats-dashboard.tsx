
'use client';

import { useEffect, useState } from 'react';
import { 
  Activity, 
  Zap, 
  Layers3, 
  Tag, 
  TrendingUp,
  Clock,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StatsResponse } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export function StatsDashboard() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-2"></div>
              <div className="h-3 bg-muted rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Failed to load statistics</p>
        </CardContent>
      </Card>
    );
  }

  const activeRate = ((stats.active / stats.total) * 100).toFixed(1);
  
  // Prepare chart data
  const triggerData = Object.entries(stats.triggers).map(([name, value]) => ({
    name,
    value,
    percentage: ((value / stats.total) * 100).toFixed(1)
  }));

  const complexityData = Object.entries(stats.complexity).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    percentage: ((value / stats.total) * 100).toFixed(1)
  }));

  const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#80D8C3'];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold count-up">{stats.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Comprehensive workflow library
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
            <Zap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold count-up text-green-600">{stats.active}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Progress value={parseFloat(activeRate)} className="flex-1 h-1" />
              <span>{activeRate}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nodes</CardTitle>
            <Layers3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold count-up">{stats.total_nodes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Avg {Math.round(stats.total_nodes / stats.total)} per workflow
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Integrations</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold count-up">{stats.unique_integrations}</div>
            <p className="text-xs text-muted-foreground">
              Unique service connections
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Trigger Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Trigger Types Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={triggerData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {triggerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any, name: any) => [`${value} workflows`, name]}
                    labelStyle={{ fontSize: 11 }}
                  />
                  <Legend 
                    verticalAlign="top"
                    wrapperStyle={{ fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Complexity Levels */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Complexity Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={complexityData} margin={{ bottom: 15 }}>
                  <XAxis 
                    dataKey="name" 
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                    label={{ value: 'Complexity Level', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }}
                  />
                  <YAxis 
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                    label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`${value} workflows`, 'Count']}
                    labelStyle={{ fontSize: 11 }}
                  />
                  <Bar dataKey="value" fill="#60B5FF" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Updated */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Last indexed:</span>
            </div>
            <span className="font-medium">
              {new Date(stats.last_indexed).toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
