
import type { Express } from "express";
import { analytics } from "../services/analytics";

export function registerAnalyticsRoutes(app: Express) {
  // Get usage metrics
  app.get("/api/analytics/metrics", async (req, res) => {
    try {
      const metrics = await analytics.getUsageMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Analytics metrics error:", error);
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  // Get system health
  app.get("/api/analytics/health", async (req, res) => {
    try {
      const health = await analytics.getSystemHealth();
      res.json(health);
    } catch (error) {
      console.error("System health error:", error);
      res.status(500).json({ message: "Failed to fetch system health" });
    }
  });

  // Track custom event
  app.post("/api/analytics/track", async (req, res) => {
    try {
      const { event, userId, properties } = req.body;
      
      if (!event) {
        return res.status(400).json({ message: "Event name is required" });
      }

      await analytics.track(event, userId, properties);
      res.json({ success: true });
    } catch (error) {
      console.error("Analytics tracking error:", error);
      res.status(500).json({ message: "Failed to track event" });
    }
  });
}
