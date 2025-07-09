
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AlertCircle, CheckCircle, RefreshCw, Database, Link } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface PlatformConnection {
  platform: string;
  isConnected: boolean;
  data: any;
  error?: string;
}

export function PlatformConnectionManager() {
  const [connections, setConnections] = useState<PlatformConnection[]>([]);
  const [loading, setLoading] = useState(false);
  const [testingPlatform, setTestingPlatform] = useState<string | null>(null);

  // Connection configs for different platforms
  const [configs, setConfigs] = useState({
    replit: {
      database_url: process.env.DATABASE_URL || '',
      replit_auth_token: ''
    },
    supabase: {
      url: '',
      anon_key: '',
      service_role_key: ''
    },
    vercel: {
      access_token: '',
      team_id: '',
      project_id: ''
    },
    neon: {
      api_key: '',
      database_url: ''
    },
    firebase: {
      project_id: '',
      private_key: '',
      client_email: ''
    }
  });

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const response = await fetch('/api/platform/connections');
      const data = await response.json();
      setConnections(data.connections || []);
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };

  const testConnection = async (platform: string) => {
    setTestingPlatform(platform);
    try {
      const response = await fetch(`/api/platform/connections/${platform}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: configs[platform] })
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchConnections();
      }
      
      return result;
    } catch (error) {
      console.error('Error testing connection:', error);
      return { success: false, error: 'Connection test failed' };
    } finally {
      setTestingPlatform(null);
    }
  };

  const saveConnection = async (platform: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/platform/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          platform, 
          config: configs[platform] 
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchConnections();
      }
      
      return result;
    } catch (error) {
      console.error('Error saving connection:', error);
      return { success: false, error: 'Failed to save connection' };
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = (platform: string, field: string, value: string) => {
    setConfigs(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value
      }
    }));
  };

  const getConnectionStatus = (platform: string) => {
    const connection = connections.find(c => c.platform === platform);
    if (!connection) return { status: 'not-configured', message: 'Not configured' };
    if (connection.isConnected) return { status: 'connected', message: 'Connected' };
    return { status: 'error', message: connection.error || 'Connection failed' };
  };

  const renderConnectionForm = (platform: string, config: any) => {
    const status = getConnectionStatus(platform);
    const connection = connections.find(c => c.platform === platform);

    return (
      <Card key={platform}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="capitalize">{platform}</CardTitle>
              <CardDescription>
                Connect to your {platform} platform and database
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={status.status === 'connected' ? 'default' : 'secondary'}>
                {status.status === 'connected' && <CheckCircle className="w-3 h-3 mr-1" />}
                {status.status === 'error' && <AlertCircle className="w-3 h-3 mr-1" />}
                {status.status === 'not-configured' && <Link className="w-3 h-3 mr-1" />}
                {status.message}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(config).map(([field, value]) => (
            <div key={field} className="space-y-2">
              <Label htmlFor={`${platform}-${field}`} className="capitalize">
                {field.replace(/_/g, ' ')}
              </Label>
              <Input
                id={`${platform}-${field}`}
                type={field.includes('key') || field.includes('token') ? 'password' : 'text'}
                value={value as string}
                onChange={(e) => updateConfig(platform, field, e.target.value)}
                placeholder={`Enter ${field.replace(/_/g, ' ')}`}
              />
            </div>
          ))}

          {connection?.isConnected && connection.data && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4" />
                <span className="font-medium">Connected Data</span>
              </div>
              {connection.data.database && (
                <div className="text-sm space-y-1">
                  <div>Tables: {connection.data.database.tables?.length || 0}</div>
                  <div>Views: {connection.data.database.views?.length || 0}</div>
                  <div>Functions: {connection.data.database.functions?.length || 0}</div>
                </div>
              )}
              {connection.data.capabilities && (
                <div className="text-sm mt-2">
                  <div className="font-medium">Capabilities:</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {connection.data.capabilities.map((cap: string) => (
                      <Badge key={cap} variant="outline" className="text-xs">
                        {cap}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() => testConnection(platform)}
              disabled={testingPlatform === platform}
              variant="outline"
              size="sm"
            >
              {testingPlatform === platform ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Link className="w-4 h-4 mr-2" />
              )}
              Test Connection
            </Button>
            <Button
              onClick={() => saveConnection(platform)}
              disabled={loading}
              size="sm"
            >
              Save Connection
            </Button>
          </div>

          {status.status === 'error' && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {status.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Platform Connections</h2>
        <p className="text-muted-foreground">
          Connect to your platforms and databases so the AI can understand what's already built and generate more accurate blueprints.
        </p>
      </div>

      <Tabs defaultValue="replit" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="replit">Replit</TabsTrigger>
          <TabsTrigger value="supabase">Supabase</TabsTrigger>
          <TabsTrigger value="vercel">Vercel</TabsTrigger>
          <TabsTrigger value="neon">Neon</TabsTrigger>
          <TabsTrigger value="firebase">Firebase</TabsTrigger>
        </TabsList>

        {Object.entries(configs).map(([platform, config]) => (
          <TabsContent key={platform} value={platform}>
            {renderConnectionForm(platform, config)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
