import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { makeGetRequest, makePostRequest, makeRawPostRequest } from "../services/koios-client.js";

const postgrest = {
  select: z.string().optional().describe("Comma-separated column names for vertical filtering"),
  order: z.string().optional().describe("Column ordering"),
  limit: z.number().min(1).max(1000).optional().describe("Max results per page (1-1000)"),
  offset: z.number().min(0).optional().describe("Pagination offset"),
};

export function registerTransactionTools(server: McpServer): void {
  server.tool(
    "koios_utxo_info",
    "Get UTxO information for given UTxO references (tx_hash#tx_index format)",
    {
      _utxo_refs: z.array(z.string()).describe("Array of UTxO references in tx_hash#tx_index format"),
      _extended: z.boolean().optional().describe("Include extended UTxO data"),
      ...postgrest,
    },
    async (params) => {
      const { _utxo_refs, _extended, ...rest } = params;
      const body: Record<string, unknown> = { _utxo_refs };
      if (_extended !== undefined) body._extended = _extended;
      return makePostRequest("/utxo_info", body, rest);
    }
  );

  server.tool(
    "koios_tx_cbor",
    "Get raw CBOR-encoded transactions by their hashes",
    {
      _tx_hashes: z.array(z.string()).describe("Array of transaction hashes"),
      ...postgrest,
    },
    async (params) => {
      const { _tx_hashes, ...rest } = params;
      return makePostRequest("/tx_cbor", { _tx_hashes }, rest);
    }
  );

  server.tool(
    "koios_tx_info",
    "Get detailed information about specific transactions including inputs, outputs, metadata, assets, etc.",
    {
      _tx_hashes: z.array(z.string()).describe("Array of transaction hashes"),
      _inputs: z.boolean().optional().describe("Include transaction inputs"),
      _metadata: z.boolean().optional().describe("Include transaction metadata"),
      _assets: z.boolean().optional().describe("Include asset information"),
      _withdrawals: z.boolean().optional().describe("Include withdrawals"),
      _certs: z.boolean().optional().describe("Include certificates"),
      _scripts: z.boolean().optional().describe("Include scripts"),
      _bytecode: z.boolean().optional().describe("Include script bytecode"),
      _governance: z.boolean().optional().describe("Include governance data"),
      ...postgrest,
    },
    async (params) => {
      const { _tx_hashes, _inputs, _metadata, _assets, _withdrawals, _certs, _scripts, _bytecode, _governance, ...rest } = params;
      const body: Record<string, unknown> = { _tx_hashes };
      if (_inputs !== undefined) body._inputs = _inputs;
      if (_metadata !== undefined) body._metadata = _metadata;
      if (_assets !== undefined) body._assets = _assets;
      if (_withdrawals !== undefined) body._withdrawals = _withdrawals;
      if (_certs !== undefined) body._certs = _certs;
      if (_scripts !== undefined) body._scripts = _scripts;
      if (_bytecode !== undefined) body._bytecode = _bytecode;
      if (_governance !== undefined) body._governance = _governance;
      return makePostRequest("/tx_info", body, rest);
    }
  );

  server.tool(
    "koios_tx_metadata",
    "Get metadata for specific transactions",
    {
      _tx_hashes: z.array(z.string()).describe("Array of transaction hashes"),
      ...postgrest,
    },
    async (params) => {
      const { _tx_hashes, ...rest } = params;
      return makePostRequest("/tx_metadata", { _tx_hashes }, rest);
    }
  );

  server.tool(
    "koios_tx_metalabels",
    "Get a list of all transaction metadata labels",
    {
      ...postgrest,
    },
    async (params) => makeGetRequest("/tx_metalabels", params)
  );

  server.tool(
    "koios_tx_by_metalabel",
    "Get transactions by metadata label",
    {
      _label: z.string().describe("Metadata label to filter by"),
      _after_block_height: z.number().optional().describe("Only return txs after this block height"),
      ...postgrest,
    },
    async (params) => {
      const { _label, _after_block_height, ...rest } = params;
      const qp: Record<string, string | number | undefined> = { ...rest, _label };
      if (_after_block_height !== undefined) qp._after_block_height = _after_block_height;
      return makeGetRequest("/tx_by_metalabel", qp);
    }
  );

  server.tool(
    "koios_submittx",
    "Submit an already serialized transaction (CBOR-encoded hex string) to the Cardano network",
    {
      tx_cbor_hex: z.string().describe("CBOR-encoded transaction as a hex string"),
    },
    async (params) => {
      const buf = Buffer.from(params.tx_cbor_hex, "hex");
      return makeRawPostRequest("/submittx", buf, "application/cbor");
    }
  );

  server.tool(
    "koios_tx_status",
    "Get the status (number of confirmations) of given transactions",
    {
      _tx_hashes: z.array(z.string()).describe("Array of transaction hashes"),
      ...postgrest,
    },
    async (params) => {
      const { _tx_hashes, ...rest } = params;
      return makePostRequest("/tx_status", { _tx_hashes }, rest);
    }
  );

  server.tool(
    "koios_tx_outs_epoch",
    "Get all transaction outputs for a specific epoch",
    {
      _epoch_no: z.number().describe("Epoch number to query"),
      ...postgrest,
    },
    async (params) => {
      const { _epoch_no, ...rest } = params;
      return makeGetRequest("/tx_outs_epoch", { ...rest, _epoch_no });
    }
  );
}
