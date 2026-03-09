import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { registerNetworkTools } from "./tools/network.js";
import { registerEpochTools } from "./tools/epoch.js";
import { registerBlockTools } from "./tools/block.js";
import { registerTransactionTools } from "./tools/transaction.js";
import { registerAddressTools } from "./tools/address.js";
import { registerAccountTools } from "./tools/account.js";
import { registerAssetTools } from "./tools/asset.js";
import { registerPoolTools } from "./tools/pool.js";
import { registerGovernanceTools } from "./tools/governance.js";
import { registerScriptTools } from "./tools/script.js";
import { registerOgmiosTools } from "./tools/ogmios.js";

const server = new McpServer({
  name: "koios-mcp-server",
  version: "1.0.0",
});

registerNetworkTools(server);
registerEpochTools(server);
registerBlockTools(server);
registerTransactionTools(server);
registerAddressTools(server);
registerAccountTools(server);
registerAssetTools(server);
registerPoolTools(server);
registerGovernanceTools(server);
registerScriptTools(server);
registerOgmiosTools(server);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Koios MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
