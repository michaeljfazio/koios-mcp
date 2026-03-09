import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { makeGetRequest } from "../services/koios-client.js";

const postgrest = {
  select: z.string().optional().describe("Comma-separated column names for vertical filtering"),
  order: z.string().optional().describe("Column ordering e.g. 'epoch_no.desc'"),
  limit: z.number().min(1).max(1000).optional().describe("Max results per page (1-1000)"),
  offset: z.number().min(0).optional().describe("Pagination offset"),
};

export function registerEpochTools(server: McpServer): void {
  server.tool(
    "koios_epoch_info",
    "Get epoch-specific information including start/end times, block counts, and transaction counts",
    {
      _epoch_no: z.number().optional().describe("Specific epoch number to query"),
      _include_next_epoch: z.boolean().optional().describe("Include next epoch info if available"),
      ...postgrest,
    },
    async (params) => {
      const { _epoch_no, _include_next_epoch, ...rest } = params;
      const qp: Record<string, string | number | boolean | undefined> = { ...rest };
      if (_epoch_no !== undefined) qp._epoch_no = String(_epoch_no);
      if (_include_next_epoch !== undefined) qp._include_next_epoch = String(_include_next_epoch);
      return makeGetRequest("/epoch_info", qp);
    }
  );

  server.tool(
    "koios_epoch_params",
    "Get protocol parameters for a specific epoch",
    {
      _epoch_no: z.number().optional().describe("Specific epoch number to query"),
      ...postgrest,
    },
    async (params) => {
      const { _epoch_no, ...rest } = params;
      const qp: Record<string, string | number | undefined> = { ...rest };
      if (_epoch_no !== undefined) qp._epoch_no = String(_epoch_no);
      return makeGetRequest("/epoch_params", qp);
    }
  );

  server.tool(
    "koios_epoch_block_protocols",
    "Get the block protocol distribution for a specific epoch",
    {
      _epoch_no: z.number().optional().describe("Specific epoch number to query"),
      ...postgrest,
    },
    async (params) => {
      const { _epoch_no, ...rest } = params;
      const qp: Record<string, string | number | undefined> = { ...rest };
      if (_epoch_no !== undefined) qp._epoch_no = String(_epoch_no);
      return makeGetRequest("/epoch_block_protocols", qp);
    }
  );
}
