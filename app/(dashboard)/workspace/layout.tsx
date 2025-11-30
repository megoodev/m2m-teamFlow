import { ReactNode } from "react";

import WorkSpaceList from "./_components/WorkSpaceList";
import CreateWorkspace from "./_components/CreateWorkspace";
import UserNav from "./_components/UserNav";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";
import { orpc } from "@/lib/orpc";

const WorkspaceLayout = async ({ children }: { children: ReactNode }) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(orpc.workspace.list.queryOptions());
  return (
    <div className="flex w-full h-screen">
      <div className="flex h-screen w-16 flex-col items-center bg-secondary py-3 px-2 border-r borderborder">
        <HydrateClient client={queryClient}>
          <WorkSpaceList />
        </HydrateClient>
        <div className="mt-4">
          <CreateWorkspace />
        </div>
        <div className="mt-auto">
          <HydrateClient client={queryClient}>
            <UserNav />
          </HydrateClient>
        </div>
      </div>
      <div className="flex flex-1"> {children}</div>
    </div>
  );
};

export default WorkspaceLayout;
