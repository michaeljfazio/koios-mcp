export interface PostgRESTParams {
  select?: string;
  order?: string;
  limit?: number;
  offset?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface KoiosErrorResponse {
  hint?: string;
  details?: string;
  code?: string;
  message?: string;
}

export interface ToolResponse {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}
