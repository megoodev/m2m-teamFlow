import { z } from "zod";

export function transformChannelName(name: string): string {
  return name
    .toLocaleLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
export const channelNameSchema = z.object({
  name: z
    .string()
    .min(2, "channel name must be at least 2 characters")
    .max(50, "Channel name must be at most 50 characters")
    .transform((name, ctx) => {
      const transformed = transformChannelName(name);
      if (transformed.length < 2) {
        ctx.addIssue({
          code: "custom",
          message:
            "Channel name must contain at leatest 2 charackters after transformation",
        });
        return z.NEVER;
      }
      return transformed;
    }),
});

export type channelNameSchemaType = z.infer<typeof channelNameSchema>;
