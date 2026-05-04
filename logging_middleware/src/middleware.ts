import type { LoggableRequest, LoggableResponse, Logger, NextHandler } from "./types.js";

export const consoleLogger: Logger = {
  info(message, meta) {
    console.log(message, meta ?? {});
  },
  error(message, meta) {
    console.error(message, meta ?? {});
  }
};

export function createRequestId(): string {
  return `req_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

export function createLoggingMiddleware(logger: Logger = consoleLogger) {
  return async function logRequest(request: LoggableRequest, next: NextHandler): Promise<LoggableResponse> {
    const requestId = request.requestId ?? createRequestId();
    const startedAt = Date.now();

    logger.info("Incoming request", {
      requestId,
      method: request.method,
      path: request.path,
      userId: request.userId
    });

    try {
      const response = await next({ ...request, requestId });
      const durationMs = Date.now() - startedAt;

      logger.info("Request completed", {
        requestId,
        method: request.method,
        path: request.path,
        statusCode: response.statusCode,
        durationMs
      });

      return response;
    } catch (error) {
      const durationMs = Date.now() - startedAt;
      logger.error("Request failed", {
        requestId,
        method: request.method,
        path: request.path,
        durationMs,
        error: error instanceof Error ? error.message : String(error)
      });

      throw error;
    }
  };
}

export function createResponseLog(request: LoggableRequest, response: LoggableResponse, durationMs: number) {
  return {
    requestId: request.requestId ?? null,
    method: request.method,
    path: request.path,
    statusCode: response.statusCode,
    durationMs
  };
}
