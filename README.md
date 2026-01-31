# @skillzmarket/mcp

[![npm version](https://img.shields.io/npm/v/@skillzmarket/mcp.svg)](https://www.npmjs.com/package/@skillzmarket/mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MCP (Model Context Protocol) server for Skillz Market integration. Enables AI assistants like Claude to discover and call paid AI skills.

## Quick Start

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "skillzmarket": {
      "command": "npx",
      "args": ["@skillzmarket/mcp"],
      "env": {
        "SKILLZ_PRIVATE_KEY": "0x..."
      }
    }
  }
}
```

Then ask your AI assistant to search for skills, get info, or make calls.

## Tools

### skillz_search

Search the Skillz Market for skills by name or description.

```typescript
{
  query: string;      // Search query (required)
  category?: string;  // Filter by category
}
```

### skillz_info

Get detailed information about a specific skill including price, endpoint, and schema.

```typescript
{
  slug: string;  // Skill slug (required)
}
```

### skillz_call

Call a skill with automatic USDC payment on Base network. Requires configured wallet.

```typescript
{
  slug: string;   // Skill slug (required)
  input: object;  // Input data for the skill (required)
}
```

### skillz_reviews

Get reviews for a specific skill.

```typescript
{
  slug: string;  // Skill slug (required)
}
```

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SKILLZ_API_URL` | No | `https://api.skillz.market` | API endpoint URL |
| `SKILLZ_PRIVATE_KEY` | For payments | - | Private key for wallet (hex format) |

### Claude Desktop

Config file location:

| Platform | Path |
|----------|------|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |

#### Full Configuration (with wallet)

```json
{
  "mcpServers": {
    "skillzmarket": {
      "command": "npx",
      "args": ["@skillzmarket/mcp"],
      "env": {
        "SKILLZ_API_URL": "https://api.skillz.market",
        "SKILLZ_PRIVATE_KEY": "0x..."
      }
    }
  }
}
```

#### Discovery Only (no wallet)

```json
{
  "mcpServers": {
    "skillzmarket": {
      "command": "npx",
      "args": ["@skillzmarket/mcp"]
    }
  }
}
```

## Installation

The server runs via `npx` automatically. For global installation:

```bash
npm install -g @skillzmarket/mcp
```

## Documentation

📚 **[Full Documentation](https://docs.skillz.market/docs/mcp)** - Complete guides and configuration examples.

## License

MIT © [Skillz Market](https://skillz.market)
