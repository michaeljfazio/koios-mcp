import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { makeGetRequest } from "../services/koios-client.js";

const postgrest = {
  select: z.string().optional().describe("Comma-separated column names for vertical filtering"),
  order: z.string().optional().describe("Column ordering e.g. 'block_no.desc'"),
  limit: z.number().min(1).max(1000).optional().describe("Max results per page (1-1000)"),
  offset: z.number().min(0).optional().describe("Pagination offset"),
};

export function registerNetworkTools(server: McpServer): void {
  server.tool(
    "koios_tip",
    "Get the current chain tip (latest block) of the Cardano blockchain",
    {
      ...postgrest,
    },
    async (params) => makeGetRequest("/tip", params)
  );

  server.tool(
    "koios_era_summaries",
    "Get a summary of all eras on the Cardano blockchain",
    {
      ...postgrest,
    },
    async (params) => makeGetRequest("/era_summaries", params)
  );

  server.tool(
    "koios_genesis",
    "Get the genesis parameters of the Cardano blockchain",
    {
      ...postgrest,
    },
    async (params) => makeGetRequest("/genesis", params)
  );

  server.tool(
    "koios_totals",
    "Get tokenomic statistics (supply, staking, treasury, reserves) per epoch",
    {
      _epoch_no: z.number().optional().describe("Specific epoch number to query"),
      ...postgrest,
    },
    async (params) => {
      const { _epoch_no, ...rest } = params;
      const qp: Record<string, string | number | undefined> = { ...rest };
      if (_epoch_no !== undefined) qp._epoch_no = String(_epoch_no);
      return makeGetRequest("/totals", qp);
    }
  );

  server.tool(
    "koios_param_updates",
    "Get protocol parameter update proposals submitted on-chain",
    {
      ...postgrest,
    },
    async (params) => makeGetRequest("/param_updates", params)
  );

  server.tool(
    "koios_cli_protocol_params",
    "Get the current protocol parameters in cardano-cli compatible format",
    {
      ...postgrest,
    },
    async (params) => makeGetRequest("/cli_protocol_params", params)
  );

  server.tool(
    "koios_reserve_withdrawals",
    "Get reserve withdrawals from the Cardano reserve",
    {
      ...postgrest,
    },
    async (params) => makeGetRequest("/reserve_withdrawals", params)
  );

  server.tool(
    "koios_treasury_withdrawals",
    "Get treasury withdrawals from the Cardano treasury",
    {
      ...postgrest,
    },
    async (params) => makeGetRequest("/treasury_withdrawals", params)
  );
}
