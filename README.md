# @pipeworx/bungie

[Bungie.net Platform API](https://bungie-net.github.io/) MCP — Destiny 2 + Bungie public data. Free API key (X-API-Key).

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1679+ live data sources.

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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/bungie/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1679+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## No MCP client? Call it over HTTP

This pack takes your own API key (`_apiKey`) — we don't front one for it, so there's no curl here that would run without it. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/manifest`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.

## Standalone (no gateway account)

This package also runs as a local stdio MCP server — no Pipeworx account, no
gateway round-trip:

```json
{
  "mcpServers": {
    "bungie": {
      "command": "npx",
      "args": ["-y", "@pipeworx/mcp-bungie"]
    }
  }
}
```

Or run it directly to confirm it starts:

```bash
npx -y @pipeworx/mcp-bungie
```

It speaks MCP over stdin/stdout and answers `initialize`/`tools/list`/`tools/call`
for **only** this pack's tools — none of the shared meta-tools the gateway
connection above adds. Same source, same tools, no ask_pipeworx routing.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Bungie data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
