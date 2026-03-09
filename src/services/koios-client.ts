import axios, { AxiosInstance, AxiosError } from "axios";
import { BASE_URLS, CHARACTER_LIMIT, DEFAULT_LIMIT } from "../constants.js";
import { PostgRESTParams, KoiosErrorResponse } from "../types.js";

const network = process.env.KOIOS_NETWORK ?? "preview";
const baseURL = BASE_URLS[network];
if (!baseURL) {
  throw new Error(
    `Invalid KOIOS_NETWORK "${network}". Must be one of: ${Object.keys(BASE_URLS).join(", ")}`
  );
}

const apiKey = process.env.KOIOS_API_KEY;

const client: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
  },
  timeout: 30000,
});

function buildQueryParams(params?: PostgRESTParams): Record<string, string> {
  const query: Record<string, string> = {};
  if (!params) return query;
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      query[key] = String(value);
    }
  }
  return query;
}

function formatError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axErr = error as AxiosError<KoiosErrorResponse>;
    const status = axErr.response?.status;
    const data = axErr.response?.data;
    if (status === 429) {
      return "Rate limit exceeded (100 requests per 10 seconds). Please wait and retry.";
    }
    if (data && typeof data === "object" && "message" in data) {
      return `Koios API error (${status}): ${data.message}${data.hint ? ` — Hint: ${data.hint}` : ""}`;
    }
    if (status) {
      return `Koios API error (${status}): ${axErr.message}`;
    }
    return `Network error: ${axErr.message}`;
  }
  if (error instanceof Error) {
    return `Error: ${error.message}`;
  }
  return `Unknown error: ${String(error)}`;
}

function truncate(text: string): string {
  if (text.length <= CHARACTER_LIMIT) return text;
  return (
    text.slice(0, CHARACTER_LIMIT) +
    "\n\n... [Response truncated. Use 'limit', 'offset', or 'select' parameters to narrow results.]"
  );
}

export async function makeGetRequest(
  endpoint: string,
  params?: PostgRESTParams
): Promise<{ content: Array<{ type: "text"; text: string }>; isError?: boolean }> {
  try {
    const queryParams = buildQueryParams(params);
    if (!queryParams.limit) {
      queryParams.limit = String(DEFAULT_LIMIT);
    }
    const response = await client.get(endpoint, { params: queryParams });
    const text = truncate(JSON.stringify(response.data, null, 2));
    return { content: [{ type: "text", text }] };
  } catch (error) {
    return {
      content: [{ type: "text", text: formatError(error) }],
      isError: true,
    };
  }
}

export async function makePostRequest(
  endpoint: string,
  body: unknown,
  params?: PostgRESTParams
): Promise<{ content: Array<{ type: "text"; text: string }>; isError?: boolean }> {
  try {
    const queryParams = buildQueryParams(params);
    if (!queryParams.limit) {
      queryParams.limit = String(DEFAULT_LIMIT);
    }
    const response = await client.post(endpoint, body, { params: queryParams });
    const text = truncate(JSON.stringify(response.data, null, 2));
    return { content: [{ type: "text", text }] };
  } catch (error) {
    return {
      content: [{ type: "text", text: formatError(error) }],
      isError: true,
    };
  }
}

export async function makeRawPostRequest(
  endpoint: string,
  body: Buffer | Uint8Array,
  contentType: string
): Promise<{ content: Array<{ type: "text"; text: string }>; isError?: boolean }> {
  try {
    const response = await client.post(endpoint, body, {
      headers: {
        "Content-Type": contentType,
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
    });
    const text = truncate(JSON.stringify(response.data, null, 2));
    return { content: [{ type: "text", text }] };
  } catch (error) {
    return {
      content: [{ type: "text", text: formatError(error) }],
      isError: true,
    };
  }
}
