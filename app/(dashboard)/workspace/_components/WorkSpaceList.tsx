"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { orpc } from "@/lib/orpc";
import { cn } from "@/lib/utils";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useSuspenseQuery } from "@tanstack/react-query";

const WorkSpaceList = () => {
  const {
    data: { workspaces, currentWorkspace },
  } = useSuspenseQuery(orpc.workspace.list.queryOptions());
  return (
    <TooltipProvider>
      <div className="flex gap-2 flex-col px-2">
        {workspaces.map((ws) => {
          const isActive = ws.id === currentWorkspace.orgCode;
          return (
            <Tooltip key={ws.id}>
              <TooltipTrigger asChild>
                <LoginLink orgCode={ws.id}>
                  <Button
                    size="sm"
                    className={cn(
                      "size-12 rounded-xl",
                      isActive &&
                        "rounded-lg hover:bg-primary/90 transition-colors duration-200"
                    )}
                  >
                    <span className="text-sm font-medium uppercase ">
                      {ws.avatar}
                    </span>
                  </Button>
                </LoginLink>
              </TooltipTrigger>
              <TooltipContent side="left" align="end">
                {ws.name} {isActive && "(current)"}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default WorkSpaceList;
