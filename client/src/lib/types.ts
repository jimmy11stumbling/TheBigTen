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

export type Platform = "replit" | "cursor" | "lovable" | "windsurf" | "bolt" | "claude" | "gemini" | "base44" | "v0" | "rork";

export interface GenerateRequest {
  prompt: string;
  platform: Platform;
  user_id?: string;
}
