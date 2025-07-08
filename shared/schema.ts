import { pgTable, text, serial, uuid, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  avatar_url: text("avatar_url"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const blueprints = pgTable("blueprints", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => users.id),
  prompt: text("prompt").notNull(),
  content: text("content").notNull(),
  platform: varchar("platform", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("idle"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const blueprintsRelations = relations(blueprints, ({ one }) => ({
  user: one(users, {
    fields: [blueprints.user_id],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  blueprints: many(blueprints),
}));

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertBlueprintSchema = createInsertSchema(blueprints).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBlueprint = z.infer<typeof insertBlueprintSchema>;
export type Blueprint = typeof blueprints.$inferSelect;

export const platformEnum = z.enum(["replit", "cursor", "lovable", "windsurf", "bolt", "claude", "gemini", "base44", "v0", "rork"]);
export const statusEnum = z.enum(["idle", "generating", "complete", "error"]);
