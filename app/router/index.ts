import { channelList, createChannel, getChannel } from "./channel";
import { createMessage, listMessages } from "./message";
import { createWorkspace, workspaceList } from "./workspace";

export const router = {
  workspace: {
    list: workspaceList,
    create: createWorkspace,
  },
  channels: {
    create: createChannel,
    list: channelList,
    get: getChannel
  },
  messages: {
    create: createMessage,
    list: listMessages,
  },
};
