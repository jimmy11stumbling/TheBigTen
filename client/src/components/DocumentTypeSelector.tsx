
import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { FileText, Code, GitMerge } from 'lucide-react';

interface DocumentTypeSelectorProps {
  selectedType: 'blueprint' | 'prd' | 'fused';
  onTypeChange: (type: 'blueprint' | 'prd' | 'fused') => void;
}

export function DocumentTypeSelector({ selectedType, onTypeChange }: DocumentTypeSelectorProps) {
  const documentTypes = [
    {
      id: 'blueprint' as const,
      title: 'Technical Blueprint',
      description: 'Comprehensive technical documentation focused on architecture, implementation, and deployment',
      icon: <Code className="w-5 h-5" />,
      features: ['System Architecture', 'Technology Stack', 'Implementation Details', 'Deployment Strategy']
    },
    {
      id: 'prd' as const,
      title: 'Product Requirements Document',
      description: 'Product-focused documentation covering user needs, features, and business goals',
      icon: <FileText className="w-5 h-5" />,
      features: ['User Stories', 'Feature Scope', 'Success Metrics', 'Market Analysis']
    },
    {
      id: 'fused' as const,
      title: 'Fused PRD + Blueprint',
      description: 'Hybrid document combining product requirements with technical implementation - the single source of truth',
      icon: <GitMerge className="w-5 h-5" />,
      features: ['Product Vision', 'Technical Architecture', 'Implementation Roadmap', 'Stakeholder Alignment'],
      recommended: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {documentTypes.map((type) => (
        <Card 
          key={type.id} 
          className={`cursor-pointer transition-all ${
            selectedType === type.id 
              ? 'ring-2 ring-primary border-primary' 
              : 'hover:shadow-md'
          } ${type.recommended ? 'border-emerald-200 bg-emerald-50' : ''}`}
          onClick={() => onTypeChange(type.id)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {type.icon}
                <CardTitle className="text-sm">{type.title}</CardTitle>
              </div>
              {type.recommended && (
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                  Recommended
                </span>
              )}
            </div>
            <CardDescription className="text-xs">
              {type.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-xs text-muted-foreground space-y-1">
              {type.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-1">
                  <span className="w-1 h-1 bg-current rounded-full"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
