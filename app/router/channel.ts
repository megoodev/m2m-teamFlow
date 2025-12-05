import z from "zod";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { base } from "../middlewares/base";
import { requiredWorkspaceMiddleware } from "../middlewares/workspace";
import { channelNameSchema } from "../schemas/channel";
import prisma from "@/lib/prisma";
import { Channel, Message } from "@/lib/generated/prisma/client";
import {
  init,
  organization_user,
  Organizations,
} from "@kinde/management-api-js";
import { KindeOrganization, KindeUser } from "@kinde-oss/kinde-auth-nextjs";

export const createChannel = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .route({
    path: "/channel",
    method: "POST",
    summary: "create new channel",
    tags: ["channels"],
  })
  .input(channelNameSchema)
  .output(z.custom<Channel>())
  .handler(async ({ context, input }) => {
    const channel = await prisma.channel.create({
      data: {
        name: input.name,
        workspaceId: context.workspace.orgCode,
        createdBy: context.user.id,
      },
    });
    return channel;
  });

export const channelList = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .route({
    path: "/channel",
    method: "GET",
    summary: "List of all channels",
    tags: ["channels"],
  })
  .input(z.void())
  .output(
    z.object({
      channels: z.array(z.custom<Channel>()),
      members: z.array(z.custom<organization_user>()),
      currentWorkspace: z.custom<KindeOrganization<unknown>>(),
    })
  )
  .handler(async ({ context }) => {
    const [channels, members] = await Promise.all([
      prisma.channel.findMany({
        where: {
          workspaceId: context.workspace.orgCode,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      (async () => {
        init();
        const usersInOrg = await Organizations.getOrganizationUsers({
          orgCode: context.workspace.orgCode,
          sort: "name_asc",
        });
        return usersInOrg.organization_users ?? [];
      })(),
    ]);

    return {
      channels,
      members,
      currentWorkspace: context.workspace,
    };
  });

export const getChannel = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .route({
    path: "/channel",
    method: "GET",
    summary: "Get a channel",
    tags: ["channel"],
  })
  .input(
    z.object({
      channelId: z.string(),
    })
  )
  .output(
    z.object({
      channelName: z.string(),
      CurrentUser: z.custom<KindeUser<Record<string, unknown>>>(),
    })
  )
  .handler(async ({ context, input, errors }) => {
    const channel = await prisma.channel.findFirst({
      where: {
        id: input.channelId,
        workspaceId: context.workspace.orgCode,
      },
      select: {
        name: true,
      },
    });

    if (!channel) {
      throw errors.NOT_FOUND();
    }

    return {
      channelName: channel.name,
      CurrentUser: context.user,
    };
  });
