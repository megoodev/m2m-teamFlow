import { channelList, createChannel, getChannel } from "./channel";
import { inviteMember } from "./member";
import { createMessage, listMessages } from "./message";
import { createWorkspace, workspaceList } from "./workspace";

export const router = {
  workspace: {
    list: workspaceList,
    create: createWorkspace,
    member: {
      invite: inviteMember,
    },
  },
  channels: {
    create: createChannel,
    list: channelList,
    get: getChannel,
  },
  messages: {
    create: createMessage,
    list: listMessages,
  },
};
