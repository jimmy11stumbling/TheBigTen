import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBlueprintSchema, statusEnum, platformEnum } from "@shared/schema";
import { z } from "zod";
import { generateBlueprint } from "./services/deepseek";

export async function registerRoutes(app: Express): Promise<Server> {
  // Blueprint generation endpoint with SSE
  app.post("/api/blueprint/generate", async (req, res) => {
    let headersSent = false;
    
    try {
      const generateSchema = z.object({
        prompt: z.string().min(1).max(500),
        platform: platformEnum,
        user_id: z.string().uuid().optional(),
        apiKey: z.string().optional(),
      });

      const { prompt, platform, user_id, apiKey } = generateSchema.parse(req.body);

      // Set SSE headers
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control",
      });
      headersSent = true;

      // Create blueprint record
      const blueprint = await storage.createBlueprint({
        prompt,
        platform,
        content: "",
        status: "generating",
        user_id: user_id || null,
      });

      let fullContent = "";

      try {
        // Stream blueprint generation
        for await (const chunk of generateBlueprint(prompt, platform, apiKey)) {
          fullContent += chunk;
          
          // Send chunk to client
          res.write(`data: ${JSON.stringify({ 
            type: "chunk", 
            content: chunk,
            fullContent,
            blueprintId: blueprint.id 
          })}\n\n`);
        }

        // Update blueprint with final content
        await storage.updateBlueprintContent(blueprint.id, fullContent, "complete");

        // Send completion event
        res.write(`data: ${JSON.stringify({ 
          type: "complete", 
          blueprintId: blueprint.id 
        })}\n\n`);

      } catch (streamError) {
        console.error("Stream error:", streamError);
        
        await storage.updateBlueprintContent(blueprint.id, fullContent, "error");
        
        res.write(`data: ${JSON.stringify({ 
          type: "error", 
          message: "Generation failed. Please try again.",
          blueprintId: blueprint.id 
        })}\n\n`);
      }

      res.end();
    } catch (error) {
      console.error("Blueprint generation error:", error);
      
      if (!headersSent) {
        res.status(400).json({ 
          message: error instanceof Error ? error.message : "Invalid request" 
        });
      } else {
        // If headers already sent, send error via SSE
        res.write(`data: ${JSON.stringify({ 
          type: "error", 
          message: error instanceof Error ? error.message : "Invalid request"
        })}\n\n`);
        res.end();
      }
    }
  });

  // Get user's blueprints
  app.get("/api/blueprints", async (req, res) => {
    try {
      const userId = req.query.user_id as string;
      const blueprints = await storage.getUserBlueprints(userId);
      res.json(blueprints);
    } catch (error) {
      console.error("Get blueprints error:", error);
      res.status(500).json({ message: "Failed to fetch blueprints" });
    }
  });

  // Get specific blueprint
  app.get("/api/blueprints/:id", async (req, res) => {
    try {
      const blueprintId = req.params.id;
      const blueprint = await storage.getBlueprintById(blueprintId);
      
      if (!blueprint) {
        return res.status(404).json({ message: "Blueprint not found" });
      }
      
      res.json(blueprint);
    } catch (error) {
      console.error("Get blueprint error:", error);
      res.status(500).json({ message: "Failed to fetch blueprint" });
    }
  });

  // Test API key endpoint
  app.post("/api/test-api-key", async (req, res) => {
    try {
      const { apiKey } = req.body;
      
      if (!apiKey) {
        return res.status(400).json({ message: "API key is required" });
      }

      // Make a simple test request to DeepSeek API
      const testResponse = await fetch("https://api.deepseek.com/v1/models", {
        headers: {
          "Authorization": `Bearer ${apiKey}`
        }
      });

      if (testResponse.ok) {
        res.json({ valid: true, message: "API key is valid" });
      } else {
        res.status(400).json({ valid: false, message: "Invalid API key" });
      }
    } catch (error) {
      console.error("API key test error:", error);
      res.status(500).json({ valid: false, message: "Unable to validate API key" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
