#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { SkillzMarket } from '@skillzmarket/sdk';
import { tools, handleTool, ToolContext } from './tools.js';
import { getWalletFromEnv } from './wallet.js';

const API_URL = process.env.SKILLZ_API_URL || 'https://api.skillzmarket.com';

async function main() {
  const wallet = getWalletFromEnv();

  const client = new SkillzMarket({
    apiUrl: API_URL,
    wallet: wallet || undefined,
  });

  const context: ToolContext = { client, wallet };

  const server = new Server(
    {
      name: 'skillzmarket',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    return handleTool(name, args as Record<string, unknown>, context);
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Skillz Market MCP server running');

  if (!wallet) {
    console.error('Warning: No wallet configured. Set SKILLZ_PRIVATE_KEY for paid skill calls.');
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
