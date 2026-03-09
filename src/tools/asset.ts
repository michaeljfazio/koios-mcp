import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { makeGetRequest, makePostRequest } from "../services/koios-client.js";

const postgrest = {
  select: z.string().optional().describe("Comma-separated column names for vertical filtering"),
  order: z.string().optional().describe("Column ordering"),
  limit: z.number().min(1).max(1000).optional().describe("Max results per page (1-1000)"),
  offset: z.number().min(0).optional().describe("Pagination offset"),
};

export function registerAssetTools(server: McpServer): void {
  server.tool(
    "koios_asset_list",
    "Get a list of all native assets on the Cardano blockchain",
    {
      ...postgrest,
    },
    async (params) => makeGetRequest("/asset_list", params)
  );

  server.tool(
    "koios_policy_asset_list",
    "Get a list of all assets minted under a given policy",
    {
      _asset_policy: z.string().describe("Asset policy ID (hex)"),
      ...postgrest,
    },
    async (params) => {
      const { _asset_policy, ...rest } = params;
      return makeGetRequest("/policy_asset_list", { ...rest, _asset_policy });
    }
  );

  server.tool(
    "koios_asset_token_registry",
    "Get asset information from the token registry (off-chain metadata)",
    {
      ...postgrest,
    },
    async (params) => makeGetRequest("/asset_token_registry", params)
  );

  server.tool(
    "koios_asset_info",
    "Get detailed information about specific assets",
    {
      _asset_list: z.array(z.array(z.string())).describe("Array of [policy_id, asset_name_hex] pairs"),
      _extended: z.boolean().optional().describe("Include extended asset data"),
      ...postgrest,
    },
    async (params) => {
      const { _asset_list, _extended, ...rest } = params;
      const body: Record<string, unknown> = { _asset_list };
      if (_extended !== undefined) body._extended = _extended;
      return makePostRequest("/asset_info", body, rest);
    }
  );

  server.tool(
    "koios_asset_utxos",
    "Get UTxOs containing specific assets",
    {
      _asset_list: z.array(z.array(z.string())).describe("Array of [policy_id, asset_name_hex] pairs"),
      _extended: z.boolean().optional().describe("Include extended UTxO data"),
      ...postgrest,
    },
    async (params) => {
      const { _asset_list, _extended, ...rest } = params;
      const body: Record<string, unknown> = { _asset_list };
      if (_extended !== undefined) body._extended = _extended;
      return makePostRequest("/asset_utxos", body, rest);
    }
  );

  server.tool(
    "koios_asset_history",
    "Get mint/burn history of a specific asset",
    {
      _asset_policy: z.string().describe("Asset policy ID (hex)"),
      _asset_name: z.string().optional().describe("Asset name (hex, empty for assets without a name)"),
      ...postgrest,
    },
    async (params) => {
      const { _asset_policy, _asset_name, ...rest } = params;
      const qp: Record<string, string | number | undefined> = { ...rest, _asset_policy };
      if (_asset_name !== undefined) qp._asset_name = _asset_name;
      return makeGetRequest("/asset_history", qp);
    }
  );

  server.tool(
    "koios_asset_addresses",
    "Get all addresses holding a specific asset",
    {
      _asset_policy: z.string().describe("Asset policy ID (hex)"),
      _asset_name: z.string().optional().describe("Asset name (hex)"),
      ...postgrest,
    },
    async (params) => {
      const { _asset_policy, _asset_name, ...rest } = params;
      const qp: Record<string, string | number | undefined> = { ...rest, _asset_policy };
      if (_asset_name !== undefined) qp._asset_name = _asset_name;
      return makeGetRequest("/asset_addresses", qp);
    }
  );

  server.tool(
    "koios_asset_nft_address",
    "Get the current address holding a specific NFT",
    {
      _asset_policy: z.string().describe("Asset policy ID (hex)"),
      _asset_name: z.string().optional().describe("Asset name (hex)"),
      ...postgrest,
    },
    async (params) => {
      const { _asset_policy, _asset_name, ...rest } = params;
      const qp: Record<string, string | number | undefined> = { ...rest, _asset_policy };
      if (_asset_name !== undefined) qp._asset_name = _asset_name;
      return makeGetRequest("/asset_nft_address", qp);
    }
  );

  server.tool(
    "koios_policy_asset_mints",
    "Get all mint/burn events for assets under a specific policy",
    {
      _asset_policy: z.string().describe("Asset policy ID (hex)"),
      ...postgrest,
    },
    async (params) => {
      const { _asset_policy, ...rest } = params;
      return makeGetRequest("/policy_asset_mints", { ...rest, _asset_policy });
    }
  );

  server.tool(
    "koios_asset_summary",
    "Get a summary of a specific asset (total transactions, wallets, mints/burns)",
    {
      _asset_policy: z.string().describe("Asset policy ID (hex)"),
      _asset_name: z.string().optional().describe("Asset name (hex)"),
      ...postgrest,
    },
    async (params) => {
      const { _asset_policy, _asset_name, ...rest } = params;
      const qp: Record<string, string | number | undefined> = { ...rest, _asset_policy };
      if (_asset_name !== undefined) qp._asset_name = _asset_name;
      return makeGetRequest("/asset_summary", qp);
    }
  );

  server.tool(
    "koios_asset_txs",
    "Get transactions involving a specific asset",
    {
      _asset_policy: z.string().describe("Asset policy ID (hex)"),
      _asset_name: z.string().optional().describe("Asset name (hex)"),
      _after_block_height: z.number().optional().describe("Only return txs after this block height"),
      _history: z.boolean().optional().describe("Include full history"),
      ...postgrest,
    },
    async (params) => {
      const { _asset_policy, _asset_name, _after_block_height, _history, ...rest } = params;
      const qp: Record<string, string | number | boolean | undefined> = { ...rest, _asset_policy };
      if (_asset_name !== undefined) qp._asset_name = _asset_name;
      if (_after_block_height !== undefined) qp._after_block_height = _after_block_height;
      if (_history !== undefined) qp._history = String(_history);
      return makeGetRequest("/asset_txs", qp);
    }
  );
}
