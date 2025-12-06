import { z } from "zod";

export const inviteMemberSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});

export type InviteMemberSchemaType = z.infer<typeof inviteMemberSchema>;
