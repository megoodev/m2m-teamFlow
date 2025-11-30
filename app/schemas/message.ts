import z from "zod";

export const messageSchema = z.object({
  content: z.string().min(1),
  channelId: z.string().uuid(),
  imageUrl: z.string().url().optional(),
});

export type MessageInputType = z.infer<typeof messageSchema>;
