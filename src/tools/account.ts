import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { makeGetRequest, makePostRequest } from "../services/koios-client.js";

const postgrest = {
  select: z.string().optional().describe("Comma-separated column names for vertical filtering"),
  order: z.string().optional().describe("Column ordering"),
  limit: z.number().min(1).max(1000).optional().describe("Max results per page (1-1000)"),
  offset: z.number().min(0).optional().describe("Pagination offset"),
};

export function registerAccountTools(server: McpServer): void {
  server.tool(
    "koios_account_list",
    "Get a list of all stake accounts on the Cardano blockchain",
    {
      ...postgrest,
    },
    async (params) => makeGetRequest("/account_list", params)
  );

  server.tool(
    "koios_account_info",
    "Get stake account information including balance, delegation, and rewards for given stake addresses",
    {
      _stake_addresses: z.array(z.string()).describe("Array of stake addresses (bech32 format)"),
      ...postgrest,
    },
    async (params) => {
      const { _stake_addresses, ...rest } = params;
      return makePostRequest("/account_info", { _stake_addresses }, rest);
    }
  );

  server.tool(
    "koios_account_info_cached",
    "Get cached stake account information (faster but may be slightly stale)",
    {
      _stake_addresses: z.array(z.string()).describe("Array of stake addresses (bech32 format)"),
      ...postgrest,
    },
    async (params) => {
      const { _stake_addresses, ...rest } = params;
      return makePostRequest("/account_info_cached", { _stake_addresses }, rest);
    }
  );

  server.tool(
    "koios_account_utxos",
    "Get UTxOs associated with given stake accounts",
    {
      _stake_addresses: z.array(z.string()).describe("Array of stake addresses (bech32 format)"),
      _extended: z.boolean().optional().describe("Include extended UTxO data"),
      ...postgrest,
    },
    async (params) => {
      const { _stake_addresses, _extended, ...rest } = params;
      const body: Record<string, unknown> = { _stake_addresses };
      if (_extended !== undefined) body._extended = _extended;
      return makePostRequest("/account_utxos", body, rest);
    }
  );

  server.tool(
    "koios_account_txs",
    "Get transaction history for a specific stake account",
    {
      _stake_address: z.string().describe("Stake address in bech32 format"),
      _after_block_height: z.number().optional().describe("Only return txs after this block height"),
      ...postgrest,
    },
    async (params) => {
      const { _stake_address, _after_block_height, ...rest } = params;
      const qp: Record<string, string | number | undefined> = { ...rest, _stake_address };
      if (_after_block_height !== undefined) qp._after_block_height = _after_block_height;
      return makeGetRequest("/account_txs", qp);
    }
  );

  server.tool(
    "koios_account_reward_history",
    "Get reward history for given stake accounts",
    {
      _stake_addresses: z.array(z.string()).describe("Array of stake addresses (bech32 format)"),
      _epoch_no: z.number().optional().describe("Filter by specific epoch"),
      ...postgrest,
    },
    async (params) => {
      const { _stake_addresses, _epoch_no, ...rest } = params;
      const body: Record<string, unknown> = { _stake_addresses };
      if (_epoch_no !== undefined) body._epoch_no = _epoch_no;
      return makePostRequest("/account_reward_history", body, rest);
    }
  );

  server.tool(
    "koios_account_updates",
    "Get account registration/deregistration updates for given stake accounts",
    {
      _stake_addresses: z.array(z.string()).describe("Array of stake addresses (bech32 format)"),
      ...postgrest,
    },
    async (params) => {
      const { _stake_addresses, ...rest } = params;
      return makePostRequest("/account_updates", { _stake_addresses }, rest);
    }
  );

  server.tool(
    "koios_account_update_history",
    "Get full update history for given stake accounts",
    {
      _stake_addresses: z.array(z.string()).describe("Array of stake addresses (bech32 format)"),
      ...postgrest,
    },
    async (params) => {
      const { _stake_addresses, ...rest } = params;
      return makePostRequest("/account_update_history", { _stake_addresses }, rest);
    }
  );

  server.tool(
    "koios_account_addresses",
    "Get all payment addresses associated with given stake accounts",
    {
      _stake_addresses: z.array(z.string()).describe("Array of stake addresses (bech32 format)"),
      _first_only: z.boolean().optional().describe("Return only the first address per stake account"),
      _empty: z.boolean().optional().describe("Include empty (zero balance) addresses"),
      ...postgrest,
    },
    async (params) => {
      const { _stake_addresses, _first_only, _empty, ...rest } = params;
      const body: Record<string, unknown> = { _stake_addresses };
      if (_first_only !== undefined) body._first_only = _first_only;
      if (_empty !== undefined) body._empty = _empty;
      return makePostRequest("/account_addresses", body, rest);
    }
  );

  server.tool(
    "koios_account_assets",
    "Get native asset holdings for given stake accounts",
    {
      _stake_addresses: z.array(z.string()).describe("Array of stake addresses (bech32 format)"),
      ...postgrest,
    },
    async (params) => {
      const { _stake_addresses, ...rest } = params;
      return makePostRequest("/account_assets", { _stake_addresses }, rest);
    }
  );

  server.tool(
    "koios_account_stake_history",
    "Get stake history (active stake per epoch) for given stake accounts",
    {
      _stake_addresses: z.array(z.string()).describe("Array of stake addresses (bech32 format)"),
      _epoch_no: z.number().optional().describe("Filter by specific epoch"),
      ...postgrest,
    },
    async (params) => {
      const { _stake_addresses, _epoch_no, ...rest } = params;
      const body: Record<string, unknown> = { _stake_addresses };
      if (_epoch_no !== undefined) body._epoch_no = _epoch_no;
      return makePostRequest("/account_stake_history", body, rest);
    }
  );
}
