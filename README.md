# @skillzmarket/mcp

MCP (Model Context Protocol) server for Skillz Market integration.

## Installation

```bash
pnpm add @skillzmarket/mcp
```

## Configuration

Add to your MCP client configuration:

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

## Tools

### skillz_search
Search for skills by name or description.

### skillz_info
Get detailed information about a skill.

### skillz_call
Call a skill with automatic USDC payment on Base.

### skillz_reviews
Get reviews for a skill.
