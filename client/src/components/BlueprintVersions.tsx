
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { GitBranch, Clock, Eye, RotateCcw, GitCompare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface BlueprintVersion {
  id: string;
  version: string;
  timestamp: Date;
  changes: string;
  size: number;
  platform: string;
}

interface BlueprintVersionsProps {
  versions: BlueprintVersion[];
  currentVersion: string;
  onRestore: (versionId: string) => void;
  onCompare: (version1: string, version2: string) => void;
  onView: (versionId: string) => void;
}

export function BlueprintVersions({ 
  versions, 
  currentVersion, 
  onRestore, 
  onCompare, 
  onView 
}: BlueprintVersionsProps) {
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

  const handleVersionSelect = (versionId: string) => {
    if (selectedVersions.includes(versionId)) {
      setSelectedVersions(selectedVersions.filter(id => id !== versionId));
    } else if (selectedVersions.length < 2) {
      setSelectedVersions([...selectedVersions, versionId]);
    } else {
      setSelectedVersions([selectedVersions[1], versionId]);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${Math.round(bytes / (1024 * 1024))} MB`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="w-5 h-5" />
          Version History
        </CardTitle>
        <CardDescription>
          Track changes and restore previous versions of your blueprint
        </CardDescription>
        {selectedVersions.length === 2 && (
          <Button 
            onClick={() => onCompare(selectedVersions[0], selectedVersions[1])}
            className="w-fit"
            size="sm"
          >
            <GitCompare className="w-4 h-4 mr-2" />
            Compare Versions
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {versions.map((version) => (
            <div 
              key={version.id}
              className={`p-4 border rounded-lg transition-colors ${
                selectedVersions.includes(version.id) 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              } ${
                version.id === currentVersion ? 'ring-2 ring-green-500' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedVersions.includes(version.id)}
                    onChange={() => handleVersionSelect(version.id)}
                    className="rounded"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">v{version.version}</span>
                      {version.id === currentVersion && (
                        <Badge variant="default" className="text-xs">Current</Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {version.platform}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(version.timestamp, { addSuffix: true })}
                      <span>•</span>
                      <span>{formatSize(version.size)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => onView(version.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {version.id !== currentVersion && (
                    <Button
                      onClick={() => onRestore(version.id)}
                      variant="outline"
                      size="sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-700 ml-6">{version.changes}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
