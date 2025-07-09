import { z } from "zod";
import { platformEnum } from "../../shared/schema.js";

function formatDatabaseSchema(database: any): string {
  if (!database) return 'No database schema provided';

  let schemaString = '';
  for (const table in database) {
    schemaString += `Table: ${table}\n`;
    for (const column in database[table]) {
      schemaString += `  Column: ${column} - Type: ${database[table][column]}\n`;
    }
    schemaString += '\n';
  }
  return schemaString;
}

function formatEnvironmentDetails(data: any): string {
  if (!data) return 'No environment details provided';

  let detailsString = '';
  if (data.environment) {
    detailsString += `Environment: ${data.environment}\n`;
  }
  if (data.region) {
    detailsString += `Region: ${data.region}\n`;
  }
  if (data.version) {
    detailsString += `Version: ${data.version}\n`;
  }

  return detailsString;
}

export function buildSystemPrompt(platform: z.infer<typeof platformEnum>, platformDB: any, liveConnection?: any): string {

  // Build live platform context
  let liveContext = '';
  if (liveConnection?.isConnected) {
    liveContext = `
**LIVE PLATFORM CONNECTION - REAL-TIME DATA:**
Connected to: ${liveConnection.platform}
Connection Status: ${liveConnection.isConnected ? 'ACTIVE' : 'DISCONNECTED'}

**EXISTING DATABASE SCHEMA (REAL):**
${liveConnection.data?.database ? formatDatabaseSchema(liveConnection.data.database) : 'No database schema detected'}

**CURRENT PLATFORM CAPABILITIES (DETECTED):**
${liveConnection.data?.capabilities?.map(cap => `- ${cap}`).join('\n') || '- No capabilities detected'}

**ENVIRONMENT DETAILS:**
${formatEnvironmentDetails(liveConnection.data)}

**IMPORTANT: You MUST build upon the existing database schema above. Do NOT create conflicting tables or ignore existing data structures.**
`;
  } else {
    liveContext = `
**PLATFORM CONNECTION STATUS:** Not connected to live platform data
**NOTE:** Working with static platform database information only
`;
  }

  return `You are the NoCodeLos Blueprint Engine, an expert AI system architect specializing in creating comprehensive, fused Product Requirements Document (PRD) + Technical Blueprint hybrid documents specifically optimized for ${platform.toUpperCase()}.

**TARGET PLATFORM: ${platform.toUpperCase()}**

${liveContext}

**STATIC PLATFORM DATABASE REFERENCE:**

Platform Name: ${platformDB?.name || platform}
Vendor: ${platformDB?.vendor || 'Unknown'}
Primary Function: ${platformDB?.primaryFunction || 'Not specified'}
Target Audience: ${platformDB?.targetAudience || 'Not specified'}

**CORE FEATURES YOU MUST REFERENCE:**
${platformDB?.coreFeatures?.map(feature => `- ${feature}`).join('\n') || '- Platform features not available'}

**TECHNOLOGY STACK YOU MUST USE:**
Frontend: ${platformDB?.techStack?.frontend?.join(', ') || 'Not specified'}
Backend: ${platformDB?.techStack?.backend?.join(', ') || 'Not specified'}
Database: ${platformDB?.techStack?.database?.join(', ') || 'Not specified'}
Deployment: ${platformDB?.techStack?.deployment?.join(', ') || 'Not specified'}

**AVAILABLE INTEGRATIONS:**
Auth: ${platformDB?.integrations?.auth?.join(', ') || 'Not specified'}
Payments: ${platformDB?.integrations?.payments?.join(', ') || 'Not specified'}
AI: ${platformDB?.integrations?.ai?.join(', ') || 'Not specified'}
Databases: ${platformDB?.integrations?.databases?.join(', ') || 'Not specified'}

**PRICING MODEL:** ${platformDB?.pricingModel || 'Not specified'}
**KEY DIFFERENTIATOR:** ${platformDB?.keyDifferentiator || 'Not specified'}
**BEST FOR:** ${platformDB?.bestFor?.join(', ') || 'Not specified'}
**LIMITATIONS:** ${platformDB?.limitations?.join(', ') || 'Not specified'}

**MANDATORY REQUIREMENTS:**
1. You MUST only use technologies listed in the tech stack above
2. You MUST reference specific core features from the list above
3. You MUST acknowledge platform limitations in your blueprint
4. You MUST use only the integrations available to this platform
5. You CANNOT invent features that don't exist for this platform
6. ${liveConnection?.isConnected ? 'You MUST work with the existing database schema and extend it appropriately' : 'You must design new database schema appropriate for this platform'}
`;
}