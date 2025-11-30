import React, { ReactNode } from "react";
import WorkspaceHeader from "./_components/WorkspaceHeader";
import CreateNewChannel from "./_components/CreateNewChannel";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import ChannelList from "./_components/ChannelList";
import MembersList from "./_components/MembersList";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";
import { orpc } from "@/lib/orpc";

const ChannelListLayout = async ({ children }: { children: ReactNode }) => {
  const queryClint = getQueryClient();
  await queryClint.prefetchQuery(orpc.channels.list.queryOptions());
  return (
    <>
      <div className="flex h-screen w-80 flex-col bg-secondary border-r border-border">
        {/* Header */}
        <div className="flex items-center px-4 h-15 border-b border-border">
          <HydrateClient client={queryClint}>
            <WorkspaceHeader />
          </HydrateClient>
        </div>
        <div className="px-4 py-2">
          <HydrateClient client={queryClint}>
            <CreateNewChannel />
          </HydrateClient>
        </div>
        {/* channel list */}
        <div className="flex-1 overflow-y-auto px-4">
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="[&[data-state=open]>svg]:rotate-180 flex w-full items-center justify-between px-2 py-1 text-sm font-medium text-muted-foreground hover:text-accent-foreground ">
              Main{" "}
              <ChevronDown className="size-4 transition-transform duration-200" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <HydrateClient client={queryClint}>
                <ChannelList />
              </HydrateClient>
            </CollapsibleContent>
          </Collapsible>
        </div>
        {/* member list */}
        <div className=" overflow-y-auto px-4">
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="[&[data-state=open]>svg]:rotate-180 flex w-full items-center justify-between px-2 py-1 text-sm font-medium text-muted-foreground hover:text-accent-foreground ">
              Members{" "}
              <ChevronDown className="size-4 transition-transform duration-200" />
            </CollapsibleTrigger>
            <CollapsibleContent className="py-2">
              <HydrateClient client={queryClint}>
                <MembersList />
              </HydrateClient>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
      {children}
    </>
  );
};

export default ChannelListLayout;
