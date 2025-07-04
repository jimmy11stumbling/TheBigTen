import { blueprints, type Blueprint, type InsertBlueprint } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Blueprint methods
  createBlueprint(insertBlueprint: InsertBlueprint): Promise<Blueprint>;
  updateBlueprintContent(id: string, content: string, status: string): Promise<Blueprint>;
  getBlueprintById(id: string): Promise<Blueprint | undefined>;
  getAllBlueprints(): Promise<Blueprint[]>;
}

export class DatabaseStorage implements IStorage {
  async createBlueprint(insertBlueprint: InsertBlueprint): Promise<Blueprint> {
    const [blueprint] = await db
      .insert(blueprints)
      .values(insertBlueprint)
      .returning();
    return blueprint;
  }

  async updateBlueprintContent(id: string, content: string, status: string): Promise<Blueprint> {
    const [blueprint] = await db
      .update(blueprints)
      .set({ 
        content, 
        status, 
        updated_at: new Date() 
      })
      .where(eq(blueprints.id, id))
      .returning();
    return blueprint;
  }

  async getBlueprintById(id: string): Promise<Blueprint | undefined> {
    const [blueprint] = await db.select().from(blueprints).where(eq(blueprints.id, id));
    return blueprint || undefined;
  }

  async getAllBlueprints(): Promise<Blueprint[]> {
    return await db.select().from(blueprints).orderBy(desc(blueprints.created_at)).limit(10);
  }
}

export const storage = new DatabaseStorage();