import { SkillzMarket, type WalletConfig } from '@skillzmarket/sdk';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

export interface ToolContext {
  client: SkillzMarket;
  wallet: WalletConfig | null;
}

export const tools = [
  {
    name: 'skillz_search',
    description: 'Search the Skillz Market for skills by name or description',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Search query' },
        category: { type: 'string', description: 'Filter by category (optional)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'skillz_info',
    description: 'Get detailed information about a specific skill including price, endpoint, and schema',
    inputSchema: {
      type: 'object' as const,
      properties: {
        slug: { type: 'string', description: 'Skill slug (unique identifier)' },
      },
      required: ['slug'],
    },
  },
  {
    name: 'skillz_call',
    description: 'Call a skill with automatic USDC payment on Base network. Requires configured wallet.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        slug: { type: 'string', description: 'Skill slug' },
        input: { type: 'object', description: 'Input data for the skill' },
      },
      required: ['slug', 'input'],
    },
  },
  {
    name: 'skillz_reviews',
    description: 'Get reviews for a specific skill',
    inputSchema: {
      type: 'object' as const,
      properties: {
        slug: { type: 'string', description: 'Skill slug' },
      },
      required: ['slug'],
    },
  },
];

export async function handleTool(
  name: string,
  args: Record<string, unknown>,
  context: ToolContext
): Promise<CallToolResult> {
  switch (name) {
    case 'skillz_search': {
      const query = args.query as string;
      const category = args.category as string | undefined;
      const results = await context.client.search(query, { category });
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    }

    case 'skillz_info': {
      const slug = args.slug as string;
      const skill = await context.client.info(slug);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(skill, null, 2),
          },
        ],
      };
    }

    case 'skillz_call': {
      if (!context.wallet) {
        return {
          content: [
            {
              type: 'text',
              text: 'Error: No wallet configured. Set SKILLZ_PRIVATE_KEY environment variable.',
            },
          ],
          isError: true,
        };
      }

      const slug = args.slug as string;
      const input = args.input as Record<string, unknown>;

      try {
        const result = await context.client.call(slug, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error calling skill: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    }

    case 'skillz_reviews': {
      const slug = args.slug as string;
      const reviews = await context.client.getReviews(slug);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(reviews, null, 2),
          },
        ],
      };
    }

    default:
      return {
        content: [
          {
            type: 'text',
            text: `Unknown tool: ${name}`,
          },
        ],
        isError: true,
      };
  }
}
