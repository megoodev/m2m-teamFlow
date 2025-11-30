/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useParams } from "next/navigation";
import ChannelHeader from "./components/ChannelHeader";
import MessageInputForm from "./components/message/MessageInputForm";
import MessageList from "./components/message/MessageList";

const channelIdPage = () => {
  const { channelId } = useParams<{ channelId: string }>();
  return (
    <div className="flex w-full h-screen">
      <div className="flex flex-col min-w-0 flex-1">
        <ChannelHeader />

        <div className="flex overflow-y-hidden mb-4 flex-1">
          <MessageList channelId={channelId} />
        </div>
        <div className="border-t bg-background p-4">
          <MessageInputForm channelId={channelId} />
        </div>
      </div>
    </div>
  );
};

export default channelIdPage;
