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
        group: { type: 'string', description: 'Filter by group slug (optional)' },
        creator: { type: 'string', description: 'Filter by creator wallet address (optional)' },
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
    description: 'Call a skill with automatic USDC payment on Base network via x402 protocol. Requires SKILLZ_PRIVATE_KEY to be configured.',
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
  {
    name: 'skillz_groups',
    description: 'List skill groups, optionally filtered by creator',
    inputSchema: {
      type: 'object' as const,
      properties: {
        creator: { type: 'string', description: 'Filter by creator wallet address (optional)' },
      },
      required: [],
    },
  },
  {
    name: 'skillz_group',
    description: 'Get details about a specific skill group including its skills',
    inputSchema: {
      type: 'object' as const,
      properties: {
        slug: { type: 'string', description: 'Group slug' },
        creator: { type: 'string', description: 'Creator wallet address (optional, for scoping)' },
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
      const group = args.group as string | undefined;
      const creator = args.creator as string | undefined;
      const results = await context.client.search(query, { category, group, creator });
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
      const slug = args.slug as string;
      const input = args.input as Record<string, unknown>;

      if (!context.wallet) {
        return {
          content: [
            {
              type: 'text',
              text: 'Error: No wallet configured. Set SKILLZ_PRIVATE_KEY environment variable for x402 payments.',
            },
          ],
          isError: true,
        };
      }

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

    case 'skillz_groups': {
      const creator = args.creator as string | undefined;
      const groups = await context.client.getGroups(creator);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(groups, null, 2),
          },
        ],
      };
    }

    case 'skillz_group': {
      const slug = args.slug as string;
      const creator = args.creator as string | undefined;
      const group = await context.client.getGroup(slug, creator);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(group, null, 2),
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
