
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CheckCircle, AlertCircle, Zap, FileText, Share, Download } from 'lucide-react';
import { Textarea } from './ui/textarea';

interface BlueprintEnhancerProps {
  blueprintContent: string;
  onEnhance: (prompt: string) => void;
  onExport: (format: 'pdf' | 'md' | 'json') => void;
}

export function BlueprintEnhancer({ blueprintContent, onEnhance, onExport }: BlueprintEnhancerProps) {
  const [enhancePrompt, setEnhancePrompt] = useState('');
  const [qualityScore, setQualityScore] = useState(85);

  const qualityChecks = [
    { name: 'Technical Architecture', status: 'complete', score: 95 },
    { name: 'Security Implementation', status: 'complete', score: 90 },
    { name: 'Performance Optimization', status: 'warning', score: 75 },
    { name: 'Testing Strategy', status: 'complete', score: 85 },
    { name: 'Deployment Configuration', status: 'complete', score: 90 },
    { name: 'Documentation Quality', status: 'warning', score: 80 },
  ];

  const getStatusIcon = (status: string) => {
    if (status === 'complete') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === 'warning') return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Quality Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" />
            Blueprint Quality Score
          </CardTitle>
          <CardDescription>
            Overall assessment of your blueprint's completeness and quality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold">{qualityScore}/100</span>
            <Badge variant={qualityScore >= 90 ? "default" : qualityScore >= 75 ? "secondary" : "destructive"}>
              {qualityScore >= 90 ? "Excellent" : qualityScore >= 75 ? "Good" : "Needs Improvement"}
            </Badge>
          </div>
          <Progress value={qualityScore} className="mb-4" />
          
          <div className="space-y-3">
            {qualityChecks.map((check, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(check.status)}
                  <span className="font-medium">{check.name}</span>
                </div>
                <span className="text-sm text-gray-600">{check.score}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhancement Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Enhance Blueprint</CardTitle>
          <CardDescription>
            Refine and improve your blueprint with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Describe what you'd like to enhance or add to the blueprint..."
            value={enhancePrompt}
            onChange={(e) => setEnhancePrompt(e.target.value)}
            rows={3}
          />
          
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={() => onEnhance("Add advanced security features and compliance measures")}
              variant="outline"
              size="sm"
            >
              🔒 Enhance Security
            </Button>
            <Button 
              onClick={() => onEnhance("Optimize for better performance and scalability")}
              variant="outline"
              size="sm"
            >
              ⚡ Improve Performance
            </Button>
            <Button 
              onClick={() => onEnhance("Add comprehensive testing strategies and CI/CD pipeline")}
              variant="outline"
              size="sm"
            >
              🧪 Add Testing
            </Button>
            <Button 
              onClick={() => onEnhance("Include monitoring, analytics, and observability features")}
              variant="outline"
              size="sm"
            >
              📊 Add Monitoring
            </Button>
          </div>

          <Button 
            onClick={() => enhancePrompt && onEnhance(enhancePrompt)}
            disabled={!enhancePrompt.trim()}
            className="w-full"
          >
            <Zap className="w-4 h-4 mr-2" />
            Enhance Blueprint
          </Button>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Blueprint
          </CardTitle>
          <CardDescription>
            Download your blueprint in various formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <Button 
              onClick={() => onExport('pdf')}
              variant="outline" 
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <FileText className="w-6 h-6" />
              <span>PDF</span>
            </Button>
            <Button 
              onClick={() => onExport('md')}
              variant="outline" 
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <FileText className="w-6 h-6" />
              <span>Markdown</span>
            </Button>
            <Button 
              onClick={() => onExport('json')}
              variant="outline" 
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <FileText className="w-6 h-6" />
              <span>JSON</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
