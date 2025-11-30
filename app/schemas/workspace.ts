import { z } from "zod";

export const WorkspaceSchema = z.object({
  name: z
    .string()
    .min(2, "channel name must be at 2 least 2 characters")
    .max(50, "Channel name must be at most 50 characters"),
});

export type WorkspaceSchemaType = z.infer<typeof WorkspaceSchema>;
