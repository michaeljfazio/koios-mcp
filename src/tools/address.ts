import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { makeGetRequest, makePostRequest } from "../services/koios-client.js";

const postgrest = {
  select: z.string().optional().describe("Comma-separated column names for vertical filtering"),
  order: z.string().optional().describe("Column ordering"),
  limit: z.number().min(1).max(1000).optional().describe("Max results per page (1-1000)"),
  offset: z.number().min(0).optional().describe("Pagination offset"),
};

export function registerAddressTools(server: McpServer): void {
  server.tool(
    "koios_address_list",
    "Get a list of all addresses with their first appearance on the blockchain",
    {
      ...postgrest,
    },
    async (params) => makeGetRequest("/address_list", params)
  );

  server.tool(
    "koios_address_info",
    "Get balance and staking information for given addresses",
    {
      _addresses: z.array(z.string()).describe("Array of Cardano addresses"),
      ...postgrest,
    },
    async (params) => {
      const { _addresses, ...rest } = params;
      return makePostRequest("/address_info", { _addresses }, rest);
    }
  );

  server.tool(
    "koios_address_utxos",
    "Get UTxO set for given addresses",
    {
      _addresses: z.array(z.string()).describe("Array of Cardano addresses"),
      _extended: z.boolean().optional().describe("Include extended UTxO data (inline datums, ref scripts)"),
      ...postgrest,
    },
    async (params) => {
      const { _addresses, _extended, ...rest } = params;
      const body: Record<string, unknown> = { _addresses };
      if (_extended !== undefined) body._extended = _extended;
      return makePostRequest("/address_utxos", body, rest);
    }
  );

  server.tool(
    "koios_address_outputs",
    "Get transaction outputs for given addresses (including spent)",
    {
      _addresses: z.array(z.string()).describe("Array of Cardano addresses"),
      _after_block_height: z.number().optional().describe("Only return outputs after this block height"),
      ...postgrest,
    },
    async (params) => {
      const { _addresses, _after_block_height, ...rest } = params;
      const body: Record<string, unknown> = { _addresses };
      if (_after_block_height !== undefined) body._after_block_height = _after_block_height;
      return makePostRequest("/address_outputs", body, rest);
    }
  );

  server.tool(
    "koios_credential_utxos",
    "Get UTxO set for given payment credentials",
    {
      _payment_credentials: z.array(z.string()).describe("Array of payment credential hashes"),
      _extended: z.boolean().optional().describe("Include extended UTxO data"),
      ...postgrest,
    },
    async (params) => {
      const { _payment_credentials, _extended, ...rest } = params;
      const body: Record<string, unknown> = { _payment_credentials };
      if (_extended !== undefined) body._extended = _extended;
      return makePostRequest("/credential_utxos", body, rest);
    }
  );

  server.tool(
    "koios_address_txs",
    "Get transaction hashes for given addresses",
    {
      _addresses: z.array(z.string()).describe("Array of Cardano addresses"),
      _after_block_height: z.number().optional().describe("Only return txs after this block height"),
      ...postgrest,
    },
    async (params) => {
      const { _addresses, _after_block_height, ...rest } = params;
      const body: Record<string, unknown> = { _addresses };
      if (_after_block_height !== undefined) body._after_block_height = _after_block_height;
      return makePostRequest("/address_txs", body, rest);
    }
  );

  server.tool(
    "koios_credential_txs",
    "Get transaction hashes for given payment credentials",
    {
      _payment_credentials: z.array(z.string()).describe("Array of payment credential hashes"),
      _after_block_height: z.number().optional().describe("Only return txs after this block height"),
      ...postgrest,
    },
    async (params) => {
      const { _payment_credentials, _after_block_height, ...rest } = params;
      const body: Record<string, unknown> = { _payment_credentials };
      if (_after_block_height !== undefined) body._after_block_height = _after_block_height;
      return makePostRequest("/credential_txs", body, rest);
    }
  );

  server.tool(
    "koios_address_assets",
    "Get native asset holdings for given addresses",
    {
      _addresses: z.array(z.string()).describe("Array of Cardano addresses"),
      ...postgrest,
    },
    async (params) => {
      const { _addresses, ...rest } = params;
      return makePostRequest("/address_assets", { _addresses }, rest);
    }
  );
}
