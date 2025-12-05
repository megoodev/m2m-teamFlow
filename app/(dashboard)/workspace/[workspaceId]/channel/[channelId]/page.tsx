/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useParams } from "next/navigation";
import ChannelHeader from "./components/ChannelHeader";
import MessageInputForm from "./components/message/MessageInputForm";
import MessageList from "./components/message/MessageList";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { Skeleton } from "@/components/ui/skeleton";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

const channelIdPage = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const { data, error, isLoading } = useQuery(
    orpc.channels.get.queryOptions({
      input: {
        channelId: channelId,
      },
    })
  );
  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <div className="flex w-full h-screen">
      <div className="flex flex-col min-w-0 flex-1">
        {isLoading ? (
          <div className="flex items-center justify-between p-2">
            <Skeleton className="w-32 h-8" />
            <div className="flex items-center gap-3 ">
              <Skeleton className="w-28 h-8" />
              <Skeleton className="w-20 h-8" />
              <Skeleton className="size-8" />
            </div>
          </div>
        ) : (
          <ChannelHeader title={data?.channelName!} />
        )}

        <div className="flex overflow-y-hidden mb-4 flex-1">
          <MessageList channelId={channelId} />
        </div>
        <div className="border-t bg-background p-4">
          <MessageInputForm
            user={data?.CurrentUser as KindeUser<Record<string, unknown>>}
            channelId={channelId}
          />
        </div>
      </div>
    </div>
  );
};

export default channelIdPage;
