import { blueprints, type Blueprint, type InsertBlueprint } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Blueprint methods
  createBlueprint(insertBlueprint: InsertBlueprint): Promise<Blueprint>;
  updateBlueprint(id: string, updates: Partial<Blueprint>): Promise<Blueprint>;
  updateBlueprintContent(id: string, content: string, status: string): Promise<Blueprint>;
  getBlueprintById(id: string): Promise<Blueprint | undefined>;
  getAllBlueprints(): Promise<Blueprint[]>;
  deleteBlueprintById(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createBlueprint(insertBlueprint: InsertBlueprint): Promise<Blueprint> {
    try {
      const [blueprint] = await db
        .insert(blueprints)
        .values(insertBlueprint)
        .returning();
      return blueprint;
    } catch (error) {
      console.error("Database error creating blueprint:", error);
      // Return a mock blueprint for development
      // const mockBlueprint: Blueprint = {
      //   id: nanoid(),
      //   ...data,
      //   created_at: new Date(),
      //   updated_at: new Date(),
      // };
      // return mockBlueprint;
      throw error; // re-throw the error so calling functions know about the failure
    }
  }

  async updateBlueprint(id: string, updates: Partial<Blueprint>): Promise<Blueprint> {
    try {
      const [blueprint] = await db
        .update(blueprints)
        .set({ 
          ...updates,
          updated_at: new Date() 
        })
        .where(eq(blueprints.id, id))
        .returning();
      return blueprint;
    } catch (error) {
      console.error("Database error updating blueprint:", error);
      // Silently continue for development
      throw error; // re-throw the error so calling functions know about the failure
    }
  }

  async updateBlueprintContent(id: string, content: string, status: string): Promise<Blueprint> {
    try {
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
    } catch (error) {
      console.error("Database error updating blueprint content:", error);
       throw error; // re-throw the error so calling functions know about the failure
    }
  }

  async getBlueprintById(id: string): Promise<Blueprint | undefined> {
    try {
      const [blueprint] = await db.select().from(blueprints).where(eq(blueprints.id, id));
      return blueprint || undefined;
    } catch (error) {
      console.error("Database error getting blueprint by id:", error);
      return undefined;
    }
  }

  async getAllBlueprints(): Promise<Blueprint[]> {
    try {
      return await db.select().from(blueprints).orderBy(desc(blueprints.created_at)).limit(10);
    } catch (error) {
      console.error("Database error getting all blueprints:", error);
      return [];
    }
  }

  async deleteBlueprintById(id: string): Promise<void> {
    try {
      await db.delete(blueprints).where(eq(blueprints.id, id));
    } catch (error) {
      console.error("Database error deleting blueprint:", error);
    }
  }
}

export const storage = new DatabaseStorage();