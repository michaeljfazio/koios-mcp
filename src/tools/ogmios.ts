import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { makePostRequest } from "../services/koios-client.js";

export function registerOgmiosTools(server: McpServer): void {
  server.tool(
    "koios_ogmios",
    "Send a JSON-RPC request to the Ogmios endpoint via Koios (supports Ogmios methods like queryLedgerState, queryNetwork, etc.)",
    {
      method: z.string().describe("Ogmios JSON-RPC method name"),
      params: z.record(z.unknown()).optional().describe("Optional parameters for the Ogmios method"),
    },
    async (input) => {
      const body: Record<string, unknown> = {
        jsonrpc: "2.0",
        method: input.method,
      };
      if (input.params !== undefined) body.params = input.params;
      return makePostRequest("/ogmios", body);
    }
  );
}
