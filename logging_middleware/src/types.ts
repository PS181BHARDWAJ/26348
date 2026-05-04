export interface LoggableRequest {
  requestId?: string;
  method: string;
  path: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: unknown;
  userId?: string;
}

export interface LoggableResponse {
  statusCode: number;
  body?: unknown;
  headers?: Record<string, string>;
}

export interface Logger {
  info(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
}

export type NextHandler = (request: LoggableRequest) => Promise<LoggableResponse> | LoggableResponse;
