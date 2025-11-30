import { client } from "@/lib/orpc";
import { redirect } from "next/navigation";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import CreateNewChannel from "./_components/CreateNewChannel";
import { Cloud } from "lucide-react";
interface Params {
  params: Promise<{ workspaceId: string }>;
}

const WorkspaceIdPage = async ({ params }: Params) => {
  const { workspaceId } = await params;
  const { channels } = await client.channels.list();
  if (channels.length > 0) {
    return redirect(`/workspace/${workspaceId}/channel/${channels[0].id}`);
  }

  return (
    <div className="flex  w-full p-16">
      <Empty className="from-muted/50 to-background h-full bg-linear-to-b  from-30% ">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Cloud />
          </EmptyMedia>
          <EmptyTitle>No channels yue!</EmptyTitle>
          <EmptyDescription>
            Create your first channel to get started.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="max-w-xs">
          <CreateNewChannel />
        </EmptyContent>
      </Empty>
    </div>
  );
};

export default WorkspaceIdPage;
