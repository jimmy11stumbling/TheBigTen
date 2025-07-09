
import { z } from "zod";
import { platformEnum } from "../../shared/schema.js";

export interface PlatformConnection {
  platform: string;
  isConnected: boolean;
  data: any;
  error?: string;
}

export interface DatabaseSchema {
  tables: Array<{
    name: string;
    columns: Array<{
      name: string;
      type: string;
      nullable: boolean;
      default?: any;
    }>;
    relationships: Array<{
      table: string;
      type: 'one-to-many' | 'many-to-one' | 'many-to-many';
      foreignKey: string;
    }>;
  }>;
  views: string[];
  functions: string[];
}

export interface PlatformConnectionConfig {
  replit?: {
    database_url?: string;
    replit_auth_token?: string;
  };
  supabase?: {
    url?: string;
    anon_key?: string;
    service_role_key?: string;
  };
  vercel?: {
    team_id?: string;
    access_token?: string;
    project_id?: string;
  };
  neon?: {
    api_key?: string;
    database_url?: string;
  };
  firebase?: {
    project_id?: string;
    private_key?: string;
    client_email?: string;
  };
}

export class PlatformConnectorService {
  private connections: Map<string, PlatformConnection> = new Map();

  async connectToPlatform(
    platform: z.infer<typeof platformEnum>, 
    config: PlatformConnectionConfig
  ): Promise<PlatformConnection> {
    try {
      const connection: PlatformConnection = {
        platform,
        isConnected: false,
        data: {}
      };

      switch (platform) {
        case 'replit':
          connection.data = await this.connectToReplit(config.replit);
          break;
        case 'supabase':
          connection.data = await this.connectToSupabase(config.supabase);
          break;
        case 'vercel':
          connection.data = await this.connectToVercel(config.vercel);
          break;
        case 'neon':
          connection.data = await this.connectToNeon(config.neon);
          break;
        case 'firebase':
          connection.data = await this.connectToFirebase(config.firebase);
          break;
        default:
          throw new Error(`Platform ${platform} not supported`);
      }

      connection.isConnected = true;
      this.connections.set(platform, connection);
      return connection;

    } catch (error) {
      const failedConnection: PlatformConnection = {
        platform,
        isConnected: false,
        data: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      this.connections.set(platform, failedConnection);
      return failedConnection;
    }
  }

  private async connectToReplit(config?: any): Promise<any> {
    const data: any = {
      environment: 'replit',
      runtime: 'nix',
      capabilities: []
    };

    // Check if we're running in Replit environment
    if (process.env.REPL_ID) {
      data.repl_id = process.env.REPL_ID;
      data.repl_owner = process.env.REPL_OWNER;
      data.repl_slug = process.env.REPL_SLUG;
      data.capabilities.push('replit-hosting', 'replit-database');
    }

    // Check for PostgreSQL database
    if (process.env.DATABASE_URL) {
      data.database = await this.inspectPostgreSQLDatabase(process.env.DATABASE_URL);
      data.capabilities.push('postgresql');
    }

    // Check for Replit KV store
    if (process.env.REPLIT_DB_URL) {
      data.kv_store = { available: true, url: process.env.REPLIT_DB_URL };
      data.capabilities.push('key-value-store');
    }

    return data;
  }

  private async connectToSupabase(config?: any): Promise<any> {
    if (!config?.url || !config?.anon_key) {
      throw new Error('Supabase URL and anon key required');
    }

    const response = await fetch(`${config.url}/rest/v1/`, {
      headers: {
        'apikey': config.anon_key,
        'Authorization': `Bearer ${config.anon_key}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to connect to Supabase');
    }

    // Get database schema
    const tablesResponse = await fetch(`${config.url}/rest/v1/?select=*`, {
      headers: {
        'apikey': config.anon_key,
        'Accept': 'application/vnd.pgrst.object+json'
      }
    });

    return {
      url: config.url,
      connected: true,
      capabilities: ['postgresql', 'auth', 'storage', 'functions'],
      schema: await this.getSupabaseSchema(config)
    };
  }

  private async connectToVercel(config?: any): Promise<any> {
    if (!config?.access_token) {
      throw new Error('Vercel access token required');
    }

    const response = await fetch('https://api.vercel.com/v2/user', {
      headers: {
        'Authorization': `Bearer ${config.access_token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to connect to Vercel');
    }

    const user = await response.json();

    // Get projects if team_id provided
    let projects = [];
    if (config.team_id) {
      const projectsResponse = await fetch(`https://api.vercel.com/v9/projects?teamId=${config.team_id}`, {
        headers: {
          'Authorization': `Bearer ${config.access_token}`
        }
      });
      
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        projects = projectsData.projects;
      }
    }

    return {
      user,
      projects,
      capabilities: ['hosting', 'serverless-functions', 'edge-functions'],
      connected: true
    };
  }

  private async connectToNeon(config?: any): Promise<any> {
    if (!config?.database_url) {
      throw new Error('Neon database URL required');
    }

    const database = await this.inspectPostgreSQLDatabase(config.database_url);
    
    return {
      database,
      capabilities: ['postgresql', 'serverless-database', 'connection-pooling'],
      connected: true
    };
  }

  private async connectToFirebase(config?: any): Promise<any> {
    if (!config?.project_id) {
      throw new Error('Firebase project ID required');
    }

    // This would typically use Firebase Admin SDK
    // For now, return basic project info
    return {
      project_id: config.project_id,
      capabilities: ['firestore', 'auth', 'storage', 'functions', 'hosting'],
      connected: true
    };
  }

  private async inspectPostgreSQLDatabase(databaseUrl: string): Promise<DatabaseSchema> {
    const { Client } = await import('pg');
    const client = new Client({ connectionString: databaseUrl });

    try {
      await client.connect();

      // Get tables
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);

      const tables = [];
      
      for (const row of tablesResult.rows) {
        const tableName = row.table_name;
        
        // Get columns for each table
        const columnsResult = await client.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = $1
          ORDER BY ordinal_position
        `, [tableName]);

        // Get foreign key relationships
        const relationshipsResult = await client.query(`
          SELECT
            kcu.column_name,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
          FROM information_schema.table_constraints AS tc
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
          WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_name = $1
        `, [tableName]);

        tables.push({
          name: tableName,
          columns: columnsResult.rows.map(col => ({
            name: col.column_name,
            type: col.data_type,
            nullable: col.is_nullable === 'YES',
            default: col.column_default
          })),
          relationships: relationshipsResult.rows.map(rel => ({
            table: rel.foreign_table_name,
            type: 'many-to-one' as const,
            foreignKey: rel.column_name
          }))
        });
      }

      // Get views
      const viewsResult = await client.query(`
        SELECT table_name 
        FROM information_schema.views 
        WHERE table_schema = 'public'
      `);

      // Get functions
      const functionsResult = await client.query(`
        SELECT routine_name 
        FROM information_schema.routines 
        WHERE routine_schema = 'public'
      `);

      return {
        tables,
        views: viewsResult.rows.map(row => row.table_name),
        functions: functionsResult.rows.map(row => row.routine_name)
      };

    } finally {
      await client.end();
    }
  }

  private async getSupabaseSchema(config: any): Promise<any> {
    // This would fetch Supabase schema via REST API
    // Implementation depends on Supabase API capabilities
    return { message: 'Schema inspection for Supabase not yet implemented' };
  }

  async getConnection(platform: string): Promise<PlatformConnection | undefined> {
    return this.connections.get(platform);
  }

  async getAllConnections(): Promise<PlatformConnection[]> {
    return Array.from(this.connections.values());
  }

  async refreshConnection(platform: string, config: PlatformConnectionConfig): Promise<PlatformConnection> {
    return this.connectToPlatform(platform as z.infer<typeof platformEnum>, config);
  }
}

export const platformConnector = new PlatformConnectorService();
