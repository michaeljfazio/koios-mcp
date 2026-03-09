# koios-mcp

An MCP (Model Context Protocol) server for the [Koios](https://www.koios.rest/) Cardano blockchain REST API. Provides LLMs with direct access to on-chain Cardano data through 95 tools covering every non-deprecated Koios endpoint.

## What is Koios?

[Koios](https://www.koios.rest/) is a decentralized and open-source public API query layer for the Cardano blockchain. It provides RESTful access to blockchain data without requiring complex infrastructure, built on top of [PostgREST](https://postgrest.org/).

## Features

- **95 tools** across 11 endpoint categories
- **All Cardano networks**: Mainnet, Preview, Preprod, Guild
- **Full PostgREST support**: Vertical/horizontal filtering, pagination, ordering
- **Optional authentication**: Works without auth; supports Bearer tokens for higher rate limits

## Tools

| Category | Tools | Description |
|----------|-------|-------------|
| Network | 8 | Chain tip, genesis params, tokenomics, protocol params, era summaries |
| Epoch | 3 | Epoch info, protocol params per epoch, block protocol distribution |
| Block | 4 | Block listing, block details, block transactions, raw CBOR |
| Transaction | 9 | TX info/status/metadata, UTxO info, submit TX, CBOR data |
| Address | 8 | Address info/UTxOs/assets/transactions, credential lookups |
| Account | 11 | Stake account info/rewards/history/delegations/assets |
| Asset | 11 | Native asset listing/info/history/holders, policy lookups, NFT address |
| Pool | 17 | Pool listing/info/delegators/blocks/history/metadata/relays/voting |
| Governance | 14 | DReps, committee info, proposals, votes, voting power history |
| Script | 6 | Script info, native/Plutus listings, redeemers, datum info |
| Ogmios | 1 | Proxy to Ogmios JSON-RPC queries |

## Installation

```bash
git clone https://github.com/michaeljfazio/koios-mcp.git
cd koios-mcp
npm install
npm run build
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `KOIOS_NETWORK` | `preview` | Network to query: `mainnet`, `preview`, `preprod`, or `guild` |
| `KOIOS_API_KEY` | — | Optional Bearer token for higher rate limits ([get one here](https://koios.rest/pricing/Pricing.html)) |

### Claude Code

Add to your Claude Code MCP settings (`~/.claude/settings.json` or project `.mcp.json`):

```json
{
  "mcpServers": {
    "koios": {
      "command": "node",
      "args": ["/path/to/koios-mcp/dist/index.js"],
      "env": {
        "KOIOS_NETWORK": "preview"
      }
    }
  }
}
```

### Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "koios": {
      "command": "node",
      "args": ["/path/to/koios-mcp/dist/index.js"],
      "env": {
        "KOIOS_NETWORK": "mainnet"
      }
    }
  }
}
```

## Usage Examples

Once connected, an LLM can use tools like:

- **`koios_tip`** — Get the latest block on the chain
- **`koios_tx_info`** — Get detailed transaction info by hash
- **`koios_address_info`** — Look up balance and UTxOs for an address
- **`koios_asset_info`** — Get metadata and minting history for native assets
- **`koios_pool_info`** — Get stake pool details
- **`koios_drep_info`** — Look up delegated representative information
- **`koios_proposal_list`** — Browse governance proposals

### PostgREST Query Features

Most GET-based tools support PostgREST query parameters for flexible data retrieval:

- **`select`** — Return only specific columns: `"block_height,epoch_no,hash"`
- **`order`** — Sort results: `"block_height.desc"`
- **`limit`** / **`offset`** — Paginate results
- **Horizontal filters** — Filter by column values using operators like `eq`, `gt`, `lt`, `gte`, `lte`, `neq`, `like`, `in`

## Development

```bash
# Watch mode with auto-reload
npm run dev

# Build
npm run build

# Run
npm start
```

## API Rate Limits

Koios public tier (no auth):
- **100 requests** per 10 seconds per IP
- **1000 rows** max per paginated response
- **30 second** query timeout
- **1 KB** request body size limit (5 KB for authenticated)

## License

MIT
