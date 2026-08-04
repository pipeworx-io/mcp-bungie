# @pipeworx/bungie

[Bungie.net Platform API](https://bungie-net.github.io/) MCP — Destiny 2 + Bungie public data. Free API key (X-API-Key).

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Auth

- Platform: `PLATFORM_BUNGIE_KEY`. BYO: `?_apiKey=…`.

## Tools

- `manifest()` — Destiny 2 manifest metadata (paths to JSON tables)
- `search_destiny_player(membership_type, display_name_with_code)` — find player (use `-1` for any platform)
- `search_destiny_players_by_global_name(page, display_name_prefix)` — search by Bungie name prefix
- `profile(membership_type, destiny_membership_id, components)` — profile + characters + inventory (components = comma-sep numbers; see Bungie docs)
- `character(membership_type, destiny_membership_id, character_id, components)` — character detail
- `linked_profiles(membership_type, membership_id, get_all_memberships?)` — cross-platform profiles
- `clan(group_id)` — clan/group detail
- `clan_members(group_id, current_page?)` — clan members
- `user_by_id(membership_id, membership_type)` — Bungie.net user
- `equipped_loadout(membership_type, destiny_membership_id, character_id)` — equipped loadout (components=205)
- `historical_stats(membership_type, destiny_membership_id, character_id?, modes?)` — stats
- `historical_stats_for_account(membership_type, destiny_membership_id)` — account-wide stats
- `entity_definition(type, hash_identifier)` — single definition (e.g. `DestinyInventoryItemDefinition` + item hash)

## Data source

`https://www.bungie.net/Platform`

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

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

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
