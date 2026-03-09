import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { makeGetRequest, makePostRequest } from "../services/koios-client.js";

const postgrest = {
  select: z.string().optional().describe("Comma-separated column names for vertical filtering"),
  order: z.string().optional().describe("Column ordering"),
  limit: z.number().min(1).max(1000).optional().describe("Max results per page (1-1000)"),
  offset: z.number().min(0).optional().describe("Pagination offset"),
};

export function registerScriptTools(server: McpServer): void {
  server.tool(
    "koios_script_info",
    "Get information about specific scripts by their hashes",
    {
      _script_hashes: z.array(z.string()).describe("Array of script hashes"),
      ...postgrest,
    },
    async (params) => {
      const { _script_hashes, ...rest } = params;
      return makePostRequest("/script_info", { _script_hashes }, rest);
    }
  );

  server.tool(
    "koios_native_script_list",
    "Get a list of all native (non-Plutus) scripts on the blockchain",
    {
      ...postgrest,
    },
    async (params) => makeGetRequest("/native_script_list", params)
  );

  server.tool(
    "koios_plutus_script_list",
    "Get a list of all Plutus scripts on the blockchain",
    {
      ...postgrest,
    },
    async (params) => makeGetRequest("/plutus_script_list", params)
  );

  server.tool(
    "koios_script_redeemers",
    "Get redeemer information for a specific script",
    {
      _script_hash: z.string().describe("Script hash to query"),
      ...postgrest,
    },
    async (params) => {
      const { _script_hash, ...rest } = params;
      return makeGetRequest("/script_redeemers", { ...rest, _script_hash });
    }
  );

  server.tool(
    "koios_reference_script_utxos",
    "Get UTxOs containing reference scripts for given script hashes",
    {
      _script_hashes: z.array(z.string()).describe("Array of script hashes"),
      ...postgrest,
    },
    async (params) => {
      const { _script_hashes, ...rest } = params;
      return makePostRequest("/reference_script_utxos", { _script_hashes }, rest);
    }
  );

  server.tool(
    "koios_datum_info",
    "Get datum information for given datum hashes",
    {
      _datum_hashes: z.array(z.string()).describe("Array of datum hashes"),
      ...postgrest,
    },
    async (params) => {
      const { _datum_hashes, ...rest } = params;
      return makePostRequest("/datum_info", { _datum_hashes }, rest);
    }
  );
}
