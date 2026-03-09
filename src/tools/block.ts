import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { makeGetRequest, makePostRequest } from "../services/koios-client.js";

const postgrest = {
  select: z.string().optional().describe("Comma-separated column names for vertical filtering"),
  order: z.string().optional().describe("Column ordering e.g. 'block_height.desc'"),
  limit: z.number().min(1).max(1000).optional().describe("Max results per page (1-1000)"),
  offset: z.number().min(0).optional().describe("Pagination offset"),
};

export function registerBlockTools(server: McpServer): void {
  server.tool(
    "koios_blocks",
    "Get a list of blocks, latest first, with pagination support",
    {
      ...postgrest,
    },
    async (params) => makeGetRequest("/blocks", params)
  );

  server.tool(
    "koios_block_info",
    "Get detailed information about specific blocks by their hashes",
    {
      _block_hashes: z.array(z.string()).describe("Array of block hashes to query"),
      ...postgrest,
    },
    async (params) => {
      const { _block_hashes, ...rest } = params;
      return makePostRequest("/block_info", { _block_hashes }, rest);
    }
  );

  server.tool(
    "koios_block_txs",
    "Get a list of all transactions included in specific blocks",
    {
      _block_hashes: z.array(z.string()).describe("Array of block hashes to query"),
      ...postgrest,
    },
    async (params) => {
      const { _block_hashes, ...rest } = params;
      return makePostRequest("/block_txs", { _block_hashes }, rest);
    }
  );

  server.tool(
    "koios_block_tx_cbor",
    "Get raw CBOR-encoded transactions from specific blocks",
    {
      _block_hashes: z.array(z.string()).describe("Array of block hashes to query"),
      ...postgrest,
    },
    async (params) => {
      const { _block_hashes, ...rest } = params;
      return makePostRequest("/block_tx_cbor", { _block_hashes }, rest);
    }
  );
}
