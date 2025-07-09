
import { Router } from 'express';
import { z } from 'zod';
import { platformConnector, PlatformConnectionConfig } from '../services/platform-connector.js';
import { platformEnum } from '../../shared/schema.js';

const router = Router();

const connectionConfigSchema = z.object({
  platform: platformEnum,
  config: z.record(z.any())
});

// Get all platform connections
router.get('/connections', async (req, res) => {
  try {
    const connections = await platformConnector.getAllConnections();
    res.json({ connections });
  } catch (error) {
    console.error('Error fetching connections:', error);
    res.status(500).json({ error: 'Failed to fetch connections' });
  }
});

// Get specific platform connection
router.get('/connections/:platform', async (req, res) => {
  try {
    const { platform } = req.params;
    const connection = await platformConnector.getConnection(platform);
    
    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }
    
    res.json({ connection });
  } catch (error) {
    console.error('Error fetching connection:', error);
    res.status(500).json({ error: 'Failed to fetch connection' });
  }
});

// Create or update platform connection
router.post('/connections', async (req, res) => {
  try {
    const { platform, config } = connectionConfigSchema.parse(req.body);
    
    const connection = await platformConnector.connectToPlatform(platform, config as PlatformConnectionConfig);
    
    res.json({ 
      success: true, 
      connection,
      message: connection.isConnected ? 'Connected successfully' : 'Connection failed'
    });
  } catch (error) {
    console.error('Error creating connection:', error);
    res.status(500).json({ 
      error: 'Failed to create connection',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Test platform connection
router.post('/connections/:platform/test', async (req, res) => {
  try {
    const { platform } = req.params;
    const { config } = req.body;
    
    const connection = await platformConnector.connectToPlatform(
      platform as z.infer<typeof platformEnum>, 
      config as PlatformConnectionConfig
    );
    
    res.json({ 
      success: connection.isConnected,
      connection,
      message: connection.isConnected ? 'Connection test successful' : 'Connection test failed'
    });
  } catch (error) {
    console.error('Error testing connection:', error);
    res.status(500).json({ 
      error: 'Connection test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Refresh platform connection
router.put('/connections/:platform/refresh', async (req, res) => {
  try {
    const { platform } = req.params;
    const { config } = req.body;
    
    const connection = await platformConnector.refreshConnection(
      platform, 
      config as PlatformConnectionConfig
    );
    
    res.json({ 
      success: connection.isConnected,
      connection,
      message: 'Connection refreshed'
    });
  } catch (error) {
    console.error('Error refreshing connection:', error);
    res.status(500).json({ 
      error: 'Failed to refresh connection',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
