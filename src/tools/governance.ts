import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { makeGetRequest, makePostRequest } from "../services/koios-client.js";

const postgrest = {
  select: z.string().optional().describe("Comma-separated column names for vertical filtering"),
  order: z.string().optional().describe("Column ordering"),
  limit: z.number().min(1).max(1000).optional().describe("Max results per page (1-1000)"),
  offset: z.number().min(0).optional().describe("Pagination offset"),
};

export function registerGovernanceTools(server: McpServer): void {
  server.tool(
    "koios_drep_epoch_summary",
    "Get DRep epoch summary statistics",
    {
      _epoch_no: z.number().optional().describe("Filter by specific epoch"),
      ...postgrest,
    },
    async (params) => {
      const { _epoch_no, ...rest } = params;
      const qp: Record<string, string | number | undefined> = { ...rest };
      if (_epoch_no !== undefined) qp._epoch_no = _epoch_no;
      return makeGetRequest("/drep_epoch_summary", qp);
    }
  );

  server.tool(
    "koios_drep_list",
    "Get a list of all registered DReps (Delegated Representatives)",
    {
      ...postgrest,
    },
    async (params) => makeGetRequest("/drep_list", params)
  );

  server.tool(
    "koios_drep_info",
    "Get detailed information about specific DReps",
    {
      _drep_ids: z.array(z.string()).describe("Array of DRep IDs"),
      ...postgrest,
    },
    async (params) => {
      const { _drep_ids, ...rest } = params;
      return makePostRequest("/drep_info", { _drep_ids }, rest);
    }
  );

  server.tool(
    "koios_drep_metadata",
    "Get metadata for specific DReps",
    {
      _drep_ids: z.array(z.string()).describe("Array of DRep IDs"),
      ...postgrest,
    },
    async (params) => {
      const { _drep_ids, ...rest } = params;
      return makePostRequest("/drep_metadata", { _drep_ids }, rest);
    }
  );

  server.tool(
    "koios_drep_updates",
    "Get registration/update events for DReps",
    {
      _drep_id: z.string().optional().describe("Specific DRep ID to query"),
      ...postgrest,
    },
    async (params) => {
      const { _drep_id, ...rest } = params;
      const qp: Record<string, string | number | undefined> = { ...rest };
      if (_drep_id !== undefined) qp._drep_id = _drep_id;
      return makeGetRequest("/drep_updates", qp);
    }
  );

  server.tool(
    "koios_drep_voting_power_history",
    "Get voting power history for a specific DRep",
    {
      _drep_id: z.string().describe("DRep ID to query"),
      _epoch_no: z.number().optional().describe("Filter by specific epoch"),
      ...postgrest,
    },
    async (params) => {
      const { _drep_id, _epoch_no, ...rest } = params;
      const qp: Record<string, string | number | undefined> = { ...rest, _drep_id };
      if (_epoch_no !== undefined) qp._epoch_no = _epoch_no;
      return makeGetRequest("/drep_voting_power_history", qp);
    }
  );

  server.tool(
    "koios_drep_delegators",
    "Get current delegators for a specific DRep",
    {
      _drep_id: z.string().describe("DRep ID to query"),
      ...postgrest,
    },
    async (params) => {
      const { _drep_id, ...rest } = params;
      return makeGetRequest("/drep_delegators", { ...rest, _drep_id });
    }
  );

  server.tool(
    "koios_committee_info",
    "Get Constitutional Committee member information",
    {
      _cc_hot_id: z.string().optional().describe("Specific CC hot credential ID"),
      ...postgrest,
    },
    async (params) => {
      const { _cc_hot_id, ...rest } = params;
      const qp: Record<string, string | number | undefined> = { ...rest };
      if (_cc_hot_id !== undefined) qp._cc_hot_id = _cc_hot_id;
      return makeGetRequest("/committee_info", qp);
    }
  );

  server.tool(
    "koios_committee_votes",
    "Get Constitutional Committee votes on governance proposals",
    {
      _cc_hot_id: z.string().optional().describe("Specific CC hot credential ID"),
      ...postgrest,
    },
    async (params) => {
      const { _cc_hot_id, ...rest } = params;
      const qp: Record<string, string | number | undefined> = { ...rest };
      if (_cc_hot_id !== undefined) qp._cc_hot_id = _cc_hot_id;
      return makeGetRequest("/committee_votes", qp);
    }
  );

  server.tool(
    "koios_proposal_list",
    "Get a list of all governance proposals",
    {
      ...postgrest,
    },
    async (params) => makeGetRequest("/proposal_list", params)
  );

  server.tool(
    "koios_voter_proposal_list",
    "Get governance proposals relevant to a specific voter",
    {
      _voter_id: z.string().optional().describe("Voter ID (DRep, SPO, or CC member)"),
      ...postgrest,
    },
    async (params) => {
      const { _voter_id, ...rest } = params;
      const qp: Record<string, string | number | undefined> = { ...rest };
      if (_voter_id !== undefined) qp._voter_id = _voter_id;
      return makeGetRequest("/voter_proposal_list", qp);
    }
  );

  server.tool(
    "koios_proposal_voting_summary",
    "Get voting summary for a specific governance proposal",
    {
      _proposal_id: z.string().describe("Proposal ID (tx_hash#index format)"),
      ...postgrest,
    },
    async (params) => {
      const { _proposal_id, ...rest } = params;
      return makeGetRequest("/proposal_voting_summary", { ...rest, _proposal_id });
    }
  );

  server.tool(
    "koios_proposal_votes",
    "Get all votes cast on a specific governance proposal",
    {
      _proposal_id: z.string().describe("Proposal ID (tx_hash#index format)"),
      ...postgrest,
    },
    async (params) => {
      const { _proposal_id, ...rest } = params;
      return makeGetRequest("/proposal_votes", { ...rest, _proposal_id });
    }
  );

  server.tool(
    "koios_vote_list",
    "Get a list of all governance votes",
    {
      ...postgrest,
    },
    async (params) => makeGetRequest("/vote_list", params)
  );
}
