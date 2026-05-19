interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Bungie.net Platform API MCP.
 */


const BASE = 'https://www.bungie.net/Platform';
const UA = 'pipeworx-mcp-bungie/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  { name: 'manifest', description: 'Destiny 2 manifest metadata.', inputSchema: { type: 'object', properties: {} } },
  {
    name: 'search_destiny_player',
    description: 'Find Destiny player by display name with code.',
    inputSchema: {
      type: 'object',
      properties: { membership_type: { type: 'number' }, display_name_with_code: { type: 'string' } },
      required: ['membership_type', 'display_name_with_code'],
    },
  },
  {
    name: 'search_destiny_players_by_global_name',
    description: 'Search Bungie names.',
    inputSchema: { type: 'object', properties: { page: { type: 'number' }, display_name_prefix: { type: 'string' } }, required: ['page', 'display_name_prefix'] },
  },
  {
    name: 'profile',
    description: 'Profile + characters + inventory.',
    inputSchema: {
      type: 'object',
      properties: { membership_type: { type: 'number' }, destiny_membership_id: { type: 'string' }, components: { type: 'string' } },
      required: ['membership_type', 'destiny_membership_id', 'components'],
    },
  },
  {
    name: 'character',
    description: 'Character detail.',
    inputSchema: {
      type: 'object',
      properties: { membership_type: { type: 'number' }, destiny_membership_id: { type: 'string' }, character_id: { type: 'string' }, components: { type: 'string' } },
      required: ['membership_type', 'destiny_membership_id', 'character_id', 'components'],
    },
  },
  {
    name: 'linked_profiles',
    description: 'Cross-platform profiles.',
    inputSchema: {
      type: 'object',
      properties: { membership_type: { type: 'number' }, membership_id: { type: 'string' }, get_all_memberships: { type: 'boolean' } },
      required: ['membership_type', 'membership_id'],
    },
  },
  { name: 'clan', description: 'Clan/group detail.', inputSchema: { type: 'object', properties: { group_id: { type: 'string' } }, required: ['group_id'] } },
  {
    name: 'clan_members',
    description: 'Clan members.',
    inputSchema: { type: 'object', properties: { group_id: { type: 'string' }, current_page: { type: 'number' } }, required: ['group_id'] },
  },
  {
    name: 'user_by_id',
    description: 'Bungie.net user.',
    inputSchema: { type: 'object', properties: { membership_id: { type: 'string' }, membership_type: { type: 'number' } }, required: ['membership_id', 'membership_type'] },
  },
  {
    name: 'equipped_loadout',
    description: 'Equipped loadout (components=205).',
    inputSchema: {
      type: 'object',
      properties: { membership_type: { type: 'number' }, destiny_membership_id: { type: 'string' }, character_id: { type: 'string' } },
      required: ['membership_type', 'destiny_membership_id', 'character_id'],
    },
  },
  {
    name: 'historical_stats',
    description: 'Historical stats.',
    inputSchema: {
      type: 'object',
      properties: {
        membership_type: { type: 'number' },
        destiny_membership_id: { type: 'string' },
        character_id: { type: 'string' },
        modes: { type: 'string' },
      },
      required: ['membership_type', 'destiny_membership_id'],
    },
  },
  {
    name: 'historical_stats_for_account',
    description: 'Account-wide stats.',
    inputSchema: {
      type: 'object',
      properties: { membership_type: { type: 'number' }, destiny_membership_id: { type: 'string' } },
      required: ['membership_type', 'destiny_membership_id'],
    },
  },
  {
    name: 'entity_definition',
    description: 'Single definition by type + hash.',
    inputSchema: { type: 'object', properties: { type: { type: 'string' }, hash_identifier: { type: 'string' } }, required: ['type', 'hash_identifier'] },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = (args._apiKey as string | undefined)?.trim();
  if (!apiKey) throw new Error('Bungie requires an API key. Set PLATFORM_BUNGIE_KEY or pass ?_apiKey=… (free at https://www.bungie.net/en/Application).');
  const get = async (path: string, params?: URLSearchParams) => {
    const url = `${BASE}${path}${params && [...params].length ? `?${params}` : ''}`;
    const res = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': UA, 'X-API-Key': apiKey } });
    if (res.status === 401 || res.status === 403) throw new Error('Bungie: invalid API key.');
    if (!res.ok) throw new Error(`Bungie: ${res.status}`);
    return res.json();
  };
  const post = async (path: string, body: unknown) => {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': UA, 'X-API-Key': apiKey },
      body: JSON.stringify(body),
    });
    if (res.status === 401 || res.status === 403) throw new Error('Bungie: invalid API key.');
    if (!res.ok) throw new Error(`Bungie: ${res.status}`);
    return res.json();
  };
  const reqStr = (k: string, ex: string) => {
    const v = args[k];
    if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${k}" is missing. Pass a string like ${ex}.`);
    return v;
  };
  const reqNum = (k: string, ex: string) => {
    const v = args[k];
    if (v == null || typeof v !== 'number') throw new Error(`Required argument "${k}" is missing. Pass a number like ${ex}.`);
    return v;
  };
  switch (name) {
    case 'manifest':
      return get('/Destiny2/Manifest/');
    case 'search_destiny_player': {
      const body = { displayName: reqStr('display_name_with_code', '"BungieFan#0001"').split('#')[0], displayNameCode: Number(reqStr('display_name_with_code', '"BungieFan#0001"').split('#')[1] || '0') };
      return post(`/Destiny2/SearchDestinyPlayerByBungieName/${reqNum('membership_type', '-1')}/`, body);
    }
    case 'search_destiny_players_by_global_name':
      return post(`/User/Search/GlobalName/${reqNum('page', '0')}/`, { displayNamePrefix: reqStr('display_name_prefix', '"Player"') });
    case 'profile': {
      const p = new URLSearchParams({ components: reqStr('components', '"100,200"') });
      return get(`/Destiny2/${reqNum('membership_type', '3')}/Profile/${encodeURIComponent(reqStr('destiny_membership_id', '"<id>"'))}/`, p);
    }
    case 'character': {
      const p = new URLSearchParams({ components: reqStr('components', '"200,205"') });
      return get(
        `/Destiny2/${reqNum('membership_type', '3')}/Profile/${encodeURIComponent(reqStr('destiny_membership_id', '"<id>"'))}/Character/${encodeURIComponent(reqStr('character_id', '"<id>"'))}/`,
        p,
      );
    }
    case 'linked_profiles': {
      const p = new URLSearchParams();
      if (args.get_all_memberships != null) p.set('getAllMemberships', args.get_all_memberships ? 'true' : 'false');
      return get(`/Destiny2/${reqNum('membership_type', '3')}/Profile/${encodeURIComponent(reqStr('membership_id', '"<id>"'))}/LinkedProfiles/`, p);
    }
    case 'clan':
      return get(`/GroupV2/${encodeURIComponent(reqStr('group_id', '"<id>"'))}/`);
    case 'clan_members': {
      const p = new URLSearchParams();
      if (args.current_page != null) p.set('currentPage', String(args.current_page));
      return get(`/GroupV2/${encodeURIComponent(reqStr('group_id', '"<id>"'))}/Members/`, p);
    }
    case 'user_by_id':
      return get(`/User/GetMembershipsById/${encodeURIComponent(reqStr('membership_id', '"<id>"'))}/${reqNum('membership_type', '254')}/`);
    case 'equipped_loadout': {
      const p = new URLSearchParams({ components: '205' });
      return get(
        `/Destiny2/${reqNum('membership_type', '3')}/Profile/${encodeURIComponent(reqStr('destiny_membership_id', '"<id>"'))}/Character/${encodeURIComponent(reqStr('character_id', '"<id>"'))}/`,
        p,
      );
    }
    case 'historical_stats': {
      const p = new URLSearchParams();
      if (args.modes) p.set('modes', String(args.modes));
      const cid = args.character_id ? `/${encodeURIComponent(String(args.character_id))}` : '/0';
      return get(`/Destiny2/${reqNum('membership_type', '3')}/Account/${encodeURIComponent(reqStr('destiny_membership_id', '"<id>"'))}/Character${cid}/Stats/`, p);
    }
    case 'historical_stats_for_account':
      return get(`/Destiny2/${reqNum('membership_type', '3')}/Account/${encodeURIComponent(reqStr('destiny_membership_id', '"<id>"'))}/Stats/`);
    case 'entity_definition':
      return get(`/Destiny2/Manifest/${encodeURIComponent(reqStr('type', '"DestinyInventoryItemDefinition"'))}/${encodeURIComponent(reqStr('hash_identifier', '"<hash>"'))}/`);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
