import { z } from "zod";

const asPayload = <const T extends number, Q>(status: T, payload: Q) => ({
  statusCode: status,
  body: payload,
});

const hasErrorMessage = (error: unknown): error is { message: string } => {
  return typeof error === "object" && error !== null && "message" in error;
};

type ErrorResponse =
  | {
      statusCode: 403;
      body: {
        message: string;
        issues: z.core.$ZodIssue[];
      };
    }
  | {
      statusCode: 501;
      body: {
        message: string;
        error: string;
      };
    };

const handle = <Args extends unknown[], T>(
  fn: (...args: Args) => Promise<T>
): ((...args: Args) => Promise<T | ErrorResponse>) => async (...args: Args) => {
  try {
    return await fn(...args);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return asPayload(403, {
        message: "Validation Error",
        issues: error.issues,
      });
    }
    return asPayload(501, {
      message: "Server Error",
      error: hasErrorMessage(error) ? error.message : "None message",
    });
  }
};

export { handle, asPayload };
