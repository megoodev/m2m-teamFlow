"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { orpc } from "@/lib/orpc";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";

const MembersList = () => {
  const {
    data: { members },
  } = useSuspenseQuery(orpc.channels.list.queryOptions());
  return (
    <div className="space-y-0.5 py-1">
      {members.map((member) => (
        <div className="flex gap-2 items-center py-2" key={member.id}>
          <Avatar className="relative">
            <Image
              src={member.picture!}
              alt="Member Image"
              fill
              className="object-cover"
            />
            <AvatarFallback className="font-medium text-lg">
              {member.full_name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{member.full_name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {member.email}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MembersList;
