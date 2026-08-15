import { z } from "zod";

const asJson = <T extends number, Q>(status: T, payload: Q) => {
  return Response.json(
    { statusCode: status, body: { ...payload } },
    { status },
  );
};

const asPayload = <const T extends number, Q>(status: T, payload: Q) => ({
  statusCode: status,
  body: payload,
});

const hasErrorMessage = (error: unknown): error is { message: string } => {
  return typeof error === "object" && error !== null && "message" in error;
};

const handle = async <T>(fn: () => Promise<T>) => {
  try {
    return await fn();
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

export { handle, asJson, asPayload };
