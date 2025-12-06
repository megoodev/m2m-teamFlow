import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Users } from "lucide-react";
import React, { useState } from "react";

const MemberOverview = () => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={() => setOpen(!open)}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Users className="size-4 mr-1" />
          <span>Members</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-0">
          {/* Header */}
          <div className="px-4 py-3 border-b">
            <h3 className="font-semibold text-sm">Workspace Members</h3>
            <p className="text-xs text-muted-foreground">Members: </p>
          </div>
          {/* Search */}
          <div className="p-3 border-b relative">
            <Search className="size-4 absolute left-3 top-1/2 transform -translate-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search members..."
              className="h-8 pl-9"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MemberOverview;
