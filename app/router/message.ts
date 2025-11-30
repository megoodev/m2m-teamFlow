import z from "zod";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { base } from "../middlewares/base";
import { requiredWorkspaceMiddleware } from "../middlewares/workspace";
import { messageSchema } from "../schemas/message";
import prisma from "@/lib/prisma";
import { Message } from "@/lib/generated/prisma/client";

export const createMessage = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .route({
    method: "POST",
    summary: "Create a new message in a channel",
    tags: ["Messages"],
    path: "/messages",
  })
  .input(messageSchema)
  .output(z.custom<Message>())
  .handler(async ({ context, errors, input }) => {
    const channel = await prisma.channel.findFirst({
      where: {
        id: input.channelId,
      },
    });
    if (!channel) {
      throw errors.FORBIDDEN();
    }
    const message = await prisma.message.create({
      data: {
        content: input.content,
        imageUrl: input?.imageUrl,
        channelId: input.channelId,
        authorEmail: context.user.email!,
        AuthorName: context.user.given_name!,
        AuthorAvatar: context.user.picture!,
        authorId: context.user.id,
      },
    });
    return { ...message };
  });
export const listMessages = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .input(
    z.object({
      channelId: z.string(),
      cursor: z.string().optional(),
      limit: z.number().min(1).max(100).optional(),
    })
  )
  .output(
    z.object({
      items: z.array(z.custom<Message>()),
      nextCursor: z.string().optional(),
    })
  )
  .route({
    method: "GET",
    summary: "List messages in a channel",
    tags: ["Messages"],
    path: "/messages",
  })
  .handler(async ({ context, errors, input }) => {
    const channel = await prisma.channel.findFirst({
      where: {
        id: input.channelId,
        workspaceId: context.workspace.orgCode,
      },
    });

    if (!channel) {
      throw errors.FORBIDDEN();
    }

    const limit = input.limit ?? 30;
    const items = await prisma.message.findMany({
      where: {
        channelId: input.channelId,
      },
      ...(input.cursor
        ? {
            cursor: { id: input.cursor },
            skip: 1,
          }
        : {}),
      take: limit,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });
    const nextCursor =
      items.length === limit ? items[items.length - 1].id : undefined;

    return {
      items,
      nextCursor,
    };
  });
