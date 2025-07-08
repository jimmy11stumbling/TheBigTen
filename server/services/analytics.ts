
import { storage } from '../storage';

interface AnalyticsEvent {
  event: string;
  userId?: string;
  properties: Record<string, any>;
  timestamp: Date;
}

interface UsageMetrics {
  totalBlueprints: number;
  blueprintsToday: number;
  blueprintsThisWeek: number;
  blueprintsThisMonth: number;
  averageGenerationTime: number;
  popularPlatforms: { platform: string; count: number }[];
  popularPrompts: { prompt: string; count: number }[];
  errorRate: number;
  userRetention: number;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];

  async track(event: string, userId?: string, properties: Record<string, any> = {}) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      userId,
      properties,
      timestamp: new Date(),
    };
    
    this.events.push(analyticsEvent);
    
    // Keep only last 10,000 events in memory
    if (this.events.length > 10000) {
      this.events = this.events.slice(-10000);
    }

    console.log(`[Analytics] ${event}`, { userId, properties });
  }

  async getUsageMetrics(): Promise<UsageMetrics> {
    try {
      const blueprints = await storage.getAllBlueprints();
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const blueprintsToday = blueprints.filter(b => new Date(b.created_at) >= todayStart).length;
      const blueprintsThisWeek = blueprints.filter(b => new Date(b.created_at) >= weekStart).length;
      const blueprintsThisMonth = blueprints.filter(b => new Date(b.created_at) >= monthStart).length;

      // Platform popularity
      const platformCounts = blueprints.reduce((acc, blueprint) => {
        acc[blueprint.platform] = (acc[blueprint.platform] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const popularPlatforms = Object.entries(platformCounts)
        .map(([platform, count]) => ({ platform, count }))
        .sort((a, b) => b.count - a.count);

      // Popular prompts (simplified - group similar prompts)
      const promptCounts = blueprints.reduce((acc, blueprint) => {
        const key = blueprint.prompt.slice(0, 50) + '...';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const popularPrompts = Object.entries(promptCounts)
        .map(([prompt, count]) => ({ prompt, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Calculate average generation time from events
      const generationEvents = this.events.filter(e => e.event === 'blueprint_generated');
      const avgTime = generationEvents.length > 0 
        ? generationEvents.reduce((sum, e) => sum + (e.properties.duration || 0), 0) / generationEvents.length
        : 0;

      // Error rate
      const errorEvents = this.events.filter(e => e.event === 'blueprint_error');
      const totalEvents = this.events.filter(e => e.event.startsWith('blueprint_'));
      const errorRate = totalEvents.length > 0 ? (errorEvents.length / totalEvents.length) * 100 : 0;

      return {
        totalBlueprints: blueprints.length,
        blueprintsToday,
        blueprintsThisWeek,
        blueprintsThisMonth,
        averageGenerationTime: Math.round(avgTime),
        popularPlatforms,
        popularPrompts,
        errorRate: Math.round(errorRate * 100) / 100,
        userRetention: 85, // Placeholder - would need user session tracking
      };
    } catch (error) {
      console.error('Error calculating usage metrics:', error);
      throw error;
    }
  }

  async getSystemHealth() {
    const now = new Date();
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
    
    const recentEvents = this.events.filter(e => e.timestamp >= lastHour);
    const errors = recentEvents.filter(e => e.event === 'blueprint_error');
    const successes = recentEvents.filter(e => e.event === 'blueprint_generated');
    
    return {
      status: errors.length / (errors.length + successes.length) < 0.05 ? 'healthy' : 'degraded',
      uptime: '99.9%', // Placeholder
      responseTime: Math.round(Math.random() * 100 + 150), // Simulated
      errorsLastHour: errors.length,
      requestsLastHour: recentEvents.length,
      timestamp: now.toISOString(),
    };
  }
}

export const analytics = new AnalyticsService();
