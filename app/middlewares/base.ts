import { os } from "@orpc/server";

export const base = os.$context<{ request: Request }>().errors({
  BAD_REQUEST: {
    message: "Bad request.",
  },
  FORBIDDEN: {
    message: "This is Forbidden.",
  },
  NOT_FOUND: {
    message: "Not found.",
  },
  UNAUTHORIZED: {
    message: "You are unauthorized.",
  },
  RATE_LIMTITED: {
    message: "You are being rate limited",
  },
  INTERNAL_SERVER_ERROR: {
    message: "Internal server error",
  },
});
