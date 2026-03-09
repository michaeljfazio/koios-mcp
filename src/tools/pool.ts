import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { makeGetRequest, makePostRequest } from "../services/koios-client.js";

const postgrest = {
  select: z.string().optional().describe("Comma-separated column names for vertical filtering"),
  order: z.string().optional().describe("Column ordering"),
  limit: z.number().min(1).max(1000).optional().describe("Max results per page (1-1000)"),
  offset: z.number().min(0).optional().describe("Pagination offset"),
};

export function registerPoolTools(server: McpServer): void {
  server.tool(
    "koios_pool_list",
    "Get a list of all registered stake pools",
    {
      ...postgrest,
    },
    async (params) => makeGetRequest("/pool_list", params)
  );

  server.tool(
    "koios_pool_info",
    "Get detailed information about specific stake pools",
    {
      _pool_bech32_ids: z.array(z.string()).describe("Array of pool IDs in bech32 format"),
      ...postgrest,
    },
    async (params) => {
      const { _pool_bech32_ids, ...rest } = params;
      return makePostRequest("/pool_info", { _pool_bech32_ids }, rest);
    }
  );

  server.tool(
    "koios_pool_stake_snapshot",
    "Get stake snapshot for a specific pool (mark, set, go snapshots)",
    {
      _pool_bech32: z.string().describe("Pool ID in bech32 format"),
      ...postgrest,
    },
    async (params) => {
      const { _pool_bech32, ...rest } = params;
      return makeGetRequest("/pool_stake_snapshot", { ...rest, _pool_bech32 });
    }
  );

  server.tool(
    "koios_pool_delegators",
    "Get current delegators for a specific pool",
    {
      _pool_bech32: z.string().describe("Pool ID in bech32 format"),
      ...postgrest,
    },
    async (params) => {
      const { _pool_bech32, ...rest } = params;
      return makeGetRequest("/pool_delegators", { ...rest, _pool_bech32 });
    }
  );

  server.tool(
    "koios_pool_delegators_history",
    "Get historical delegators for a specific pool",
    {
      _pool_bech32: z.string().describe("Pool ID in bech32 format"),
      _epoch_no: z.number().optional().describe("Filter by specific epoch"),
      ...postgrest,
    },
    async (params) => {
      const { _pool_bech32, _epoch_no, ...rest } = params;
      const qp: Record<string, string | number | undefined> = { ...rest, _pool_bech32 };
      if (_epoch_no !== undefined) qp._epoch_no = _epoch_no;
      return makeGetRequest("/pool_delegators_history", qp);
    }
  );

  server.tool(
    "koios_pool_invalid_delegators",
    "Get invalid delegators for a specific pool",
    {
      _pool_bech32: z.string().describe("Pool ID in bech32 format"),
      _epoch_no: z.number().optional().describe("Filter by specific epoch"),
      ...postgrest,
    },
    async (params) => {
      const { _pool_bech32, _epoch_no, ...rest } = params;
      const qp: Record<string, string | number | undefined> = { ...rest, _pool_bech32 };
      if (_epoch_no !== undefined) qp._epoch_no = _epoch_no;
      return makeGetRequest("/pool_invalid_delegators", qp);
    }
  );

  server.tool(
    "koios_pool_blocks",
    "Get blocks minted by a specific pool",
    {
      _pool_bech32: z.string().describe("Pool ID in bech32 format"),
      _epoch_no: z.number().optional().describe("Filter by specific epoch"),
      ...postgrest,
    },
    async (params) => {
      const { _pool_bech32, _epoch_no, ...rest } = params;
      const qp: Record<string, string | number | undefined> = { ...rest, _pool_bech32 };
      if (_epoch_no !== undefined) qp._epoch_no = _epoch_no;
      return makeGetRequest("/pool_blocks", qp);
    }
  );

  server.tool(
    "koios_pool_owner_history",
    "Get owner history for specific pools",
    {
      _pool_bech32_ids: z.array(z.string()).describe("Array of pool IDs in bech32 format"),
      ...postgrest,
    },
    async (params) => {
      const { _pool_bech32_ids, ...rest } = params;
      return makePostRequest("/pool_owner_history", { _pool_bech32_ids }, rest);
    }
  );

  server.tool(
    "koios_pool_history",
    "Get historical performance data for a specific pool",
    {
      _pool_bech32: z.string().describe("Pool ID in bech32 format"),
      _epoch_no: z.number().optional().describe("Filter by specific epoch"),
      ...postgrest,
    },
    async (params) => {
      const { _pool_bech32, _epoch_no, ...rest } = params;
      const qp: Record<string, string | number | undefined> = { ...rest, _pool_bech32 };
      if (_epoch_no !== undefined) qp._epoch_no = _epoch_no;
      return makeGetRequest("/pool_history", qp);
    }
  );

  server.tool(
    "koios_pool_updates",
    "Get pool registration/update/retirement certificates",
    {
      _pool_bech32: z.string().optional().describe("Pool ID in bech32 format (optional, returns all if omitted)"),
      ...postgrest,
    },
    async (params) => {
      const { _pool_bech32, ...rest } = params;
      const qp: Record<string, string | number | undefined> = { ...rest };
      if (_pool_bech32 !== undefined) qp._pool_bech32 = _pool_bech32;
      return makeGetRequest("/pool_updates", qp);
    }
  );

  server.tool(
    "koios_pool_registrations",
    "Get pool registrations for a specific epoch or all epochs",
    {
      _epoch_no: z.number().optional().describe("Filter by specific epoch"),
      ...postgrest,
    },
    async (params) => {
      const { _epoch_no, ...rest } = params;
      const qp: Record<string, string | number | undefined> = { ...rest };
      if (_epoch_no !== undefined) qp._epoch_no = _epoch_no;
      return makeGetRequest("/pool_registrations", qp);
    }
  );

  server.tool(
    "koios_pool_retirements",
    "Get pool retirements for a specific epoch or all epochs",
    {
      _epoch_no: z.number().optional().describe("Filter by specific epoch"),
      ...postgrest,
    },
    async (params) => {
      const { _epoch_no, ...rest } = params;
      const qp: Record<string, string | number | undefined> = { ...rest };
      if (_epoch_no !== undefined) qp._epoch_no = _epoch_no;
      return makeGetRequest("/pool_retirements", qp);
    }
  );

  server.tool(
    "koios_pool_relays",
    "Get a list of registered pool relays",
    {
      ...postgrest,
    },
    async (params) => makeGetRequest("/pool_relays", params)
  );

  server.tool(
    "koios_pool_groups",
    "Get pool groups (pools sharing the same owner/reward accounts)",
    {
      ...postgrest,
    },
    async (params) => makeGetRequest("/pool_groups", params)
  );

  server.tool(
    "koios_pool_metadata",
    "Get metadata for specific stake pools",
    {
      _pool_bech32_ids: z.array(z.string()).describe("Array of pool IDs in bech32 format"),
      ...postgrest,
    },
    async (params) => {
      const { _pool_bech32_ids, ...rest } = params;
      return makePostRequest("/pool_metadata", { _pool_bech32_ids }, rest);
    }
  );

  server.tool(
    "koios_pool_calidus_keys",
    "Get Calidus keys for stake pools",
    {
      ...postgrest,
    },
    async (params) => makeGetRequest("/pool_calidus_keys", params)
  );

  server.tool(
    "koios_pool_voting_power_history",
    "Get voting power history for stake pools",
    {
      _pool_bech32: z.string().optional().describe("Pool ID in bech32 format"),
      _epoch_no: z.number().optional().describe("Filter by specific epoch"),
      ...postgrest,
    },
    async (params) => {
      const { _pool_bech32, _epoch_no, ...rest } = params;
      const qp: Record<string, string | number | undefined> = { ...rest };
      if (_pool_bech32 !== undefined) qp._pool_bech32 = _pool_bech32;
      if (_epoch_no !== undefined) qp._epoch_no = _epoch_no;
      return makeGetRequest("/pool_voting_power_history", qp);
    }
  );
}
