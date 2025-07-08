import { platformEnum } from "@shared/schema";
import { z } from "zod";

export type Platform = z.infer<typeof platformEnum>;

export interface StreamEvent {
  type: "chunk" | "complete" | "error";
  content?: string;
  fullContent?: string;
  blueprintId?: string;
  message?: string;
  error?: string;
}

export interface StreamState {
  content: string;
  status: "idle" | "generating" | "complete" | "error";
  error?: string;
  blueprintId?: string;
}

export interface GenerateRequest {
  prompt: string;
  platform: Platform;
  user_id?: string;
}
