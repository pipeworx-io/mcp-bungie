# mcp-bungie

Bungie.net Destiny 2 + clan API: manifest, profile, characters, stats.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search_destiny_player` | Find Destiny player by display name with code. |
| `search_destiny_players_by_global_name` | Search Bungie names. |
| `profile` | Profile + characters + inventory. |
| `character` | Character detail. |
| `linked_profiles` | Cross-platform profiles. |
| `clan_members` | Clan members. |
| `user_by_id` | Bungie.net user. |
| `equipped_loadout` | Equipped loadout (components=205). |
| `historical_stats` | Historical stats. |
| `historical_stats_for_account` | Account-wide stats. |
| `entity_definition` | Single definition by type + hash. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "bungie": {
      "url": "https://gateway.pipeworx.io/bungie/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Bungie data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
