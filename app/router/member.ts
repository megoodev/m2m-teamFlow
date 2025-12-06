import z from "zod";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { base } from "../middlewares/base";
import { requiredWorkspaceMiddleware } from "../middlewares/workspace";
import { init, Organizations, Users } from "@kinde/management-api-js";

export const inviteMember = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)

  .route({
    path: "/workspace/member",
    tags: ["member"],
    summary: "Invite a new member",
    method: "POST",
  })
    .input(z.object({
        name: z.string().min(1),
        email: z.email()
    }))
  .output(z.void())
  .handler(async ({ errors, input, context }) => {
    try {
      init();
      await Users.createUser({
        requestBody: {
          organization_code: context.workspace.orgCode,
          profile: {
            given_name: input.name,
            picture: "",
          },
          identities: [
            {
              type: "email",
              details: {
                email: input.email,
              },
            },
          ],
        },
      });
      
    } catch {
      throw errors.INTERNAL_SERVER_ERROR();
    }
  });
