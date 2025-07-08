// Blueprint Quality Assessment and Enhancement Service
// Ensures 9/10+ ratings across all platforms through comprehensive quality validation

import { z } from 'zod';
import { platformEnum } from '../../shared/schema';
import { getPlatformDatabase } from '../../shared/platform-databases';

export interface QualityMetrics {
  platformAccuracy: number;    // 0-10 rating
  technicalAccuracy: number;   // 0-10 rating
  completeness: number;        // 0-10 rating
  actionability: number;       // 0-10 rating
  scalability: number;         // 0-10 rating
  security: number;           // 0-10 rating
  performance: number;        // 0-10 rating
  overallScore: number;       // Average of all metrics
}

export interface QualityValidation {
  isValid: boolean;
  metrics: QualityMetrics;
  issues: string[];
  recommendations: string[];
  enhancementSuggestions: string[];
}

// Quality validation criteria for 9/10+ ratings
const QUALITY_THRESHOLDS = {
  minimum: 9.0,
  excellent: 9.5,
  perfect: 10.0
};

export class BlueprintQualityService {
  
  /**
   * Validates blueprint quality against platform-specific criteria
   */
  async validateBlueprintQuality(
    content: string, 
    platform: z.infer<typeof platformEnum>, 
    prompt: string
  ): Promise<QualityValidation> {
    const platformDB = getPlatformDatabase(platform);
    
    const metrics = await this.calculateQualityMetrics(content, platform, prompt);
    const issues = this.identifyQualityIssues(content, platform, metrics);
    const recommendations = this.generateRecommendations(metrics, platform);
    const enhancementSuggestions = this.generateEnhancements(content, platform, metrics);
    
    return {
      isValid: metrics.overallScore >= QUALITY_THRESHOLDS.minimum,
      metrics,
      issues,
      recommendations,
      enhancementSuggestions
    };
  }

  /**
   * Calculate comprehensive quality metrics
   */
  private async calculateQualityMetrics(
    content: string, 
    platform: z.infer<typeof platformEnum>, 
    prompt: string
  ): Promise<QualityMetrics> {
    const platformDB = getPlatformDatabase(platform);
    
    // Platform Accuracy (9/10 target)
    const platformAccuracy = this.assessPlatformAccuracy(content, platform, platformDB);
    
    // Technical Accuracy (9/10 target)
    const technicalAccuracy = this.assessTechnicalAccuracy(content, platform);
    
    // Completeness (9/10 target)
    const completeness = this.assessCompleteness(content, prompt);
    
    // Actionability (9/10 target)
    const actionability = this.assessActionability(content);
    
    // Scalability (9/10 target)
    const scalability = this.assessScalability(content, platform);
    
    // Security (9/10 target)
    const security = this.assessSecurity(content, platform);
    
    // Performance (9/10 target)
    const performance = this.assessPerformance(content, platform);
    
    const overallScore = (platformAccuracy + technicalAccuracy + completeness + 
                         actionability + scalability + security + performance) / 7;
    
    return {
      platformAccuracy,
      technicalAccuracy,
      completeness,
      actionability,
      scalability,
      security,
      performance,
      overallScore
    };
  }

  /**
   * Assess platform-specific accuracy and alignment
   */
  private assessPlatformAccuracy(content: string, platform: string, platformDB: any): number {
    let score = 10.0;
    
    if (!platformDB) return 5.0; // No platform data available
    
    // Check for platform-specific technologies
    const requiredTech = [
      ...platformDB.techStack.frontend,
      ...platformDB.techStack.backend,
      ...platformDB.techStack.database
    ];
    
    const techMentioned = requiredTech.filter(tech => 
      content.toLowerCase().includes(tech.toLowerCase())
    );
    
    if (techMentioned.length < requiredTech.length * 0.6) {
      score -= 2.0; // Deduct for missing core technologies
    }
    
    // Check for platform core features utilization
    const coreFeatures = platformDB.coreFeatures || [];
    const featuresUtilized = coreFeatures.filter(feature => 
      content.toLowerCase().includes(feature.toLowerCase().split(' ')[0])
    );
    
    if (featuresUtilized.length < coreFeatures.length * 0.5) {
      score -= 1.5; // Deduct for not leveraging core features
    }
    
    // Check for competitor platform mentions (should be avoided)
    const competitorMentions = this.findCompetitorMentions(content, platform);
    if (competitorMentions.length > 0) {
      score -= 1.0; // Deduct for mentioning competitors
    }
    
    // Check for platform-specific pricing alignment
    if (!content.toLowerCase().includes(platformDB.pricingModel.toLowerCase().split(' ')[0])) {
      score -= 0.5; // Minor deduction for not considering pricing model
    }
    
    return Math.max(0, Math.min(10, score));
  }

  /**
   * Assess technical accuracy and modern best practices
   */
  private assessTechnicalAccuracy(content: string, platform: string): number {
    let score = 10.0;
    
    // Check for modern tech stack patterns
    const modernPatterns = [
      'typescript', 'react', 'next.js', 'tailwind', 'postgresql', 
      'authentication', 'api', 'database', 'security', 'performance'
    ];
    
    const patternsFound = modernPatterns.filter(pattern => 
      content.toLowerCase().includes(pattern)
    );
    
    if (patternsFound.length < modernPatterns.length * 0.7) {
      score -= 1.5; // Deduct for missing modern patterns
    }
    
    // Check for security considerations
    const securityPatterns = ['authentication', 'authorization', 'encryption', 'security', 'cors', 'https'];
    const securityFound = securityPatterns.filter(pattern => 
      content.toLowerCase().includes(pattern)
    );
    
    if (securityFound.length < 3) {
      score -= 1.0; // Deduct for insufficient security coverage
    }
    
    // Check for scalability considerations
    const scalabilityPatterns = ['scaling', 'performance', 'caching', 'database', 'optimization'];
    const scalabilityFound = scalabilityPatterns.filter(pattern => 
      content.toLowerCase().includes(pattern)
    );
    
    if (scalabilityFound.length < 3) {
      score -= 1.0; // Deduct for insufficient scalability coverage
    }
    
    return Math.max(0, Math.min(10, score));
  }

  /**
   * Assess completeness of the blueprint
   */
  private assessCompleteness(content: string, prompt: string): number {
    let score = 10.0;
    
    // Essential sections that should be present
    const essentialSections = [
      'architecture', 'database', 'authentication', 'api', 'frontend', 
      'backend', 'deployment', 'security', 'testing', 'performance'
    ];
    
    const sectionsFound = essentialSections.filter(section => 
      content.toLowerCase().includes(section)
    );
    
    if (sectionsFound.length < essentialSections.length * 0.8) {
      score -= 2.0; // Major deduction for missing essential sections
    }
    
    // Check for code examples
    const codeBlocks = (content.match(/```/g) || []).length / 2;
    if (codeBlocks < 5) {
      score -= 1.0; // Deduct for insufficient code examples
    }
    
    // Check for implementation details
    if (content.length < 5000) {
      score -= 1.5; // Deduct for insufficient detail
    }
    
    return Math.max(0, Math.min(10, score));
  }

  /**
   * Assess actionability - how executable the blueprint is
   */
  private assessActionability(content: string): number {
    let score = 10.0;
    
    // Check for step-by-step instructions
    const stepPatterns = ['step', 'install', 'configure', 'create', 'implement'];
    const stepsFound = stepPatterns.filter(pattern => 
      content.toLowerCase().includes(pattern)
    );
    
    if (stepsFound.length < 4) {
      score -= 1.5; // Deduct for lack of actionable steps
    }
    
    // Check for specific commands or configurations
    const commandPatterns = ['npm', 'yarn', 'pip', 'git', 'docker', 'curl'];
    const commandsFound = commandPatterns.filter(pattern => 
      content.toLowerCase().includes(pattern)
    );
    
    if (commandsFound.length < 2) {
      score -= 1.0; // Deduct for lack of specific commands
    }
    
    // Check for TODO or placeholder items (should be minimal)
    const placeholders = (content.match(/todo|placeholder|tbd|fix|implement/gi) || []).length;
    if (placeholders > 3) {
      score -= 2.0; // Major deduction for too many placeholders
    }
    
    return Math.max(0, Math.min(10, score));
  }

  /**
   * Assess scalability considerations
   */
  private assessScalability(content: string, platform: string): number {
    let score = 10.0;
    
    const scalabilityPatterns = [
      'horizontal scaling', 'load balancing', 'caching', 'cdn', 
      'microservices', 'database optimization', 'performance'
    ];
    
    const patternsFound = scalabilityPatterns.filter(pattern => 
      content.toLowerCase().includes(pattern.toLowerCase())
    );
    
    if (patternsFound.length < 3) {
      score -= 2.0; // Deduct for insufficient scalability planning
    }
    
    return Math.max(0, Math.min(10, score));
  }

  /**
   * Assess security implementation
   */
  private assessSecurity(content: string, platform: string): number {
    let score = 10.0;
    
    const securityPatterns = [
      'authentication', 'authorization', 'encryption', 'https', 
      'cors', 'csrf', 'sql injection', 'xss', 'security headers'
    ];
    
    const patternsFound = securityPatterns.filter(pattern => 
      content.toLowerCase().includes(pattern.toLowerCase())
    );
    
    if (patternsFound.length < 4) {
      score -= 2.0; // Deduct for insufficient security coverage
    }
    
    return Math.max(0, Math.min(10, score));
  }

  /**
   * Assess performance optimization
   */
  private assessPerformance(content: string, platform: string): number {
    let score = 10.0;
    
    const performancePatterns = [
      'optimization', 'caching', 'lazy loading', 'code splitting', 
      'database indexing', 'cdn', 'compression', 'minification'
    ];
    
    const patternsFound = performancePatterns.filter(pattern => 
      content.toLowerCase().includes(pattern.toLowerCase())
    );
    
    if (patternsFound.length < 3) {
      score -= 1.5; // Deduct for insufficient performance considerations
    }
    
    return Math.max(0, Math.min(10, score));
  }

  /**
   * Identify quality issues that need addressing
   */
  private identifyQualityIssues(content: string, platform: string, metrics: QualityMetrics): string[] {
    const issues: string[] = [];
    
    if (metrics.platformAccuracy < QUALITY_THRESHOLDS.minimum) {
      issues.push(`Platform accuracy too low (${metrics.platformAccuracy.toFixed(1)}/10) - missing platform-specific features and technologies`);
    }
    
    if (metrics.technicalAccuracy < QUALITY_THRESHOLDS.minimum) {
      issues.push(`Technical accuracy needs improvement (${metrics.technicalAccuracy.toFixed(1)}/10) - modernize tech stack and patterns`);
    }
    
    if (metrics.completeness < QUALITY_THRESHOLDS.minimum) {
      issues.push(`Blueprint incomplete (${metrics.completeness.toFixed(1)}/10) - missing essential sections and details`);
    }
    
    if (metrics.actionability < QUALITY_THRESHOLDS.minimum) {
      issues.push(`Low actionability (${metrics.actionability.toFixed(1)}/10) - need more specific implementation steps`);
    }
    
    if (metrics.scalability < QUALITY_THRESHOLDS.minimum) {
      issues.push(`Insufficient scalability planning (${metrics.scalability.toFixed(1)}/10) - add enterprise-grade scaling strategies`);
    }
    
    if (metrics.security < QUALITY_THRESHOLDS.minimum) {
      issues.push(`Security coverage inadequate (${metrics.security.toFixed(1)}/10) - implement comprehensive security measures`);
    }
    
    if (metrics.performance < QUALITY_THRESHOLDS.minimum) {
      issues.push(`Performance optimization missing (${metrics.performance.toFixed(1)}/10) - add performance enhancement strategies`);
    }
    
    return issues;
  }

  /**
   * Generate recommendations for improvement
   */
  private generateRecommendations(metrics: QualityMetrics, platform: string): string[] {
    const recommendations: string[] = [];
    
    if (metrics.overallScore < QUALITY_THRESHOLDS.minimum) {
      recommendations.push(`Overall score ${metrics.overallScore.toFixed(1)}/10 needs improvement to reach 9/10+ target`);
    }
    
    if (metrics.platformAccuracy < QUALITY_THRESHOLDS.excellent) {
      recommendations.push(`Enhance platform-specific integration and feature utilization for ${platform}`);
    }
    
    if (metrics.technicalAccuracy < QUALITY_THRESHOLDS.excellent) {
      recommendations.push(`Update to latest technical patterns and industry best practices`);
    }
    
    if (metrics.completeness < QUALITY_THRESHOLDS.excellent) {
      recommendations.push(`Add more comprehensive sections with detailed implementation guidance`);
    }
    
    return recommendations;
  }

  /**
   * Generate specific enhancement suggestions
   */
  private generateEnhancements(content: string, platform: string, metrics: QualityMetrics): string[] {
    const enhancements: string[] = [];
    
    const platformDB = getPlatformDatabase(platform);
    
    if (platformDB) {
      // Platform-specific enhancements
      enhancements.push(`Integrate ${platformDB.coreFeatures.slice(0, 3).join(', ')} for better platform utilization`);
      enhancements.push(`Optimize for ${platformDB.targetAudience} with appropriate complexity level`);
      enhancements.push(`Leverage ${platformDB.keyDifferentiator} as primary architectural advantage`);
    }
    
    // Technical enhancements
    if (metrics.technicalAccuracy < QUALITY_THRESHOLDS.excellent) {
      enhancements.push(`Add TypeScript for enhanced type safety and developer experience`);
      enhancements.push(`Implement modern authentication patterns with JWT and OAuth2`);
      enhancements.push(`Include comprehensive testing strategy with unit and integration tests`);
    }
    
    // Security enhancements
    if (metrics.security < QUALITY_THRESHOLDS.excellent) {
      enhancements.push(`Add security headers, CORS configuration, and input validation`);
      enhancements.push(`Implement rate limiting and DDoS protection mechanisms`);
      enhancements.push(`Include encryption at rest and in transit specifications`);
    }
    
    // Performance enhancements
    if (metrics.performance < QUALITY_THRESHOLDS.excellent) {
      enhancements.push(`Add caching strategies with Redis and CDN integration`);
      enhancements.push(`Implement database optimization with proper indexing`);
      enhancements.push(`Include code splitting and lazy loading for frontend optimization`);
    }
    
    return enhancements;
  }

  /**
   * Find mentions of competitor platforms
   */
  private findCompetitorMentions(content: string, targetPlatform: string): string[] {
    const allPlatforms = ['replit', 'cursor', 'lovable', 'windsurf', 'bolt', 'claude', 'gemini', 'base44', 'v0', 'rork'];
    const competitors = allPlatforms.filter(p => p !== targetPlatform);
    
    return competitors.filter(competitor => 
      content.toLowerCase().includes(competitor.toLowerCase())
    );
  }
}

export const blueprintQuality = new BlueprintQualityService();