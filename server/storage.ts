import { users, blueprints, type User, type InsertUser, type Blueprint, type InsertBlueprint } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  
  // Blueprint methods
  createBlueprint(insertBlueprint: InsertBlueprint): Promise<Blueprint>;
  updateBlueprintContent(id: string, content: string, status: string): Promise<Blueprint>;
  getBlueprintById(id: string): Promise<Blueprint | undefined>;
  getUserBlueprints(userId?: string): Promise<Blueprint[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

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

  async getUserBlueprints(userId?: string): Promise<Blueprint[]> {
    if (!userId) {
      return await db.select().from(blueprints).orderBy(desc(blueprints.created_at)).limit(10);
    }
    
    return await db
      .select()
      .from(blueprints)
      .where(eq(blueprints.user_id, userId))
      .orderBy(desc(blueprints.created_at));
  }
}

export const storage = new DatabaseStorage();