import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBlueprintSchema, statusEnum, platformEnum } from "@shared/schema";
import { z } from "zod";
import { generateBlueprint } from "./services/deepseek";
import { analytics } from "./services/analytics";
import { registerAnalyticsRoutes } from "./routes/analytics";
import { buildSystemPrompt } from "./services/system-prompt";
import { getPlatformDatabase } from "@shared/platform-databases";

export async function registerRoutes(app: Express): Promise<Server> {
  // Blueprint generation endpoint with SSE
  app.post("/api/blueprint/generate", async (req, res) => {
    let headersSent = false;

    try {
      const generateSchema = z.object({
        prompt: z.string().min(1).max(8192),
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

      // Create blueprint record with error handling
      let blueprint;
      try {
        blueprint = await storage.createBlueprint({
          prompt,
          platform,
          content: "",
          status: "generating",
        });
      } catch (dbError) {
        console.error("Database connection error:", dbError);
        res.write(`data: ${JSON.stringify({
          type: "error",
          error: "Database connection failed. Please try again."
        })}\n\n`);
        res.end();
        return;
      }

      let fullContent = "";
      const startTime = Date.now();

      try {
        // Track generation start
        await analytics.track('blueprint_generation_started', user_id, { 
          platform, 
          promptLength: prompt.length,
          hasApiKey: !!apiKey 
        });

        // Generate blueprint with streaming
        try {
          let chunkBuffer = "";
          let lastSendTime = Date.now();

          for await (const chunk of generateBlueprint(prompt, platform, apiKey)) {
            if (chunk) {
              fullContent += chunk;
              chunkBuffer += chunk;

              const currentTime = Date.now();
              // Send chunks every 3 characters OR every 30ms for optimal streaming
              if (chunkBuffer.length >= 3 || (currentTime - lastSendTime) >= 30) {
                res.write(`data: ${JSON.stringify({
                  type: "chunk",
                  content: chunkBuffer,
                  fullContent,
                  blueprintId: blueprint.id
                })}\n\n`);

                chunkBuffer = "";
                lastSendTime = currentTime;
              }
            }
          }

          // Send any remaining buffered content
          if (chunkBuffer.length > 0) {
            res.write(`data: ${JSON.stringify({
              type: "chunk",
              content: chunkBuffer,
              fullContent,
              blueprintId: blueprint.id
            })}\n\n`);
          }

          // Update blueprint with final content
          await storage.updateBlueprint(blueprint.id, {
            content: fullContent,
            status: "complete",
            generated_at: new Date(),
          });

          // Send completion signal
          res.write(`data: ${JSON.stringify({
            type: "complete",
            blueprintId: blueprint.id,
            fullContent
          })}\n\n`);

          // Track successful generation
          await analytics.track('blueprint_generated', user_id, { 
            platform, 
            promptLength: prompt.length,
            contentLength: fullContent.length,
            duration: Date.now() - startTime,
            hasApiKey: !!apiKey
          });

        } catch (generationError) {
          console.error("Blueprint generation error:", generationError);

          // Update blueprint with error status
          await storage.updateBlueprint(blueprint.id, {
            status: "error",
            generated_at: new Date(),
          });

          // Send error signal
          res.write(`data: ${JSON.stringify({
            type: "error",
            error: generationError instanceof Error ? generationError.message : "Generation failed",
            blueprintId: blueprint.id
          })}\n\n`);

          // Track error
          await analytics.track('blueprint_error', user_id, { 
            platform, 
            promptLength: prompt.length,
            error: generationError instanceof Error ? generationError.message : "Unknown error",
            duration: Date.now() - startTime,
            hasApiKey: !!apiKey
          });
        }

        res.end();
      } catch (error) {
        console.error("Blueprint generation error:", error);

        if (!headersSent) {
          res.status(500).json({ 
            message: "Failed to generate blueprint",
            error: error instanceof Error ? error.message : "Unknown error"
          });
        } else {
          res.write(`data: ${JSON.stringify({
            type: "error",
            error: error instanceof Error ? error.message : "Failed to generate blueprint"
          })}\n\n`);
          res.end();
        }
      }
    } catch (error) {
        console.error("Request parsing error:", error);
        if (!headersSent) {
          res.status(400).json({ 
            message: error instanceof Error ? error.message : "Invalid request" 
          });
        }
      }
    });

    // Get recent blueprints
    app.get("/api/blueprints", async (req, res) => {
      try {
        const blueprints = await storage.getAllBlueprints();
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

    // Delete specific blueprint
    app.delete("/api/blueprints/:id", async (req, res) => {
      try {
        const blueprintId = req.params.id;
        const blueprint = await storage.getBlueprintById(blueprintId);

        if (!blueprint) {
          return res.status(404).json({ message: "Blueprint not found" });
        }

        await storage.deleteBlueprintById(blueprintId);
        res.json({ message: "Blueprint deleted successfully" });
      } catch (error) {
        console.error("Delete blueprint error:", error);
        res.status(500).json({ message: "Failed to delete blueprint" });
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

    // Register analytics routes
    registerAnalyticsRoutes(app);

    // Debug endpoint to check system prompt
    app.get("/api/debug/system-prompt/:platform", (req, res) => {
      try {
        const platform = req.params.platform as any;
        const platformDB = getPlatformDatabase(platform);
        const systemPrompt = buildSystemPrompt(platform, platformDB);
        res.json({ 
          platform,
          promptLength: systemPrompt.length,
          prompt: systemPrompt.substring(0, 500) + "...",
          containsWorkout: systemPrompt.includes("workout"),
          containsPlaceholder: false,
          fullPrompt: systemPrompt
        });
      } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
      }
    });

    const httpServer = createServer(app);
    return httpServer;
  }