"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LogoutLink,
  PortalLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreditCard, LogOutIcon, User } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";

const UserNav = () => {
  const {
    data: { user },
  } = useSuspenseQuery(orpc.workspace.list.queryOptions());
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            className="object-cover"
            alt="user image"
            src={user.picture || ""}
          />
          <AvatarFallback>{user.username?.slice(0, 2)}</AvatarFallback>s
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="left" align="end" alignOffset={88}>
        <DropdownMenuLabel className="font-normal flex items-center gap-2 px-1 py-1">
          <Avatar>
            <AvatarImage
              className="object-cover"
              alt="user image"
              src={user.picture as string}
            />
            <AvatarFallback>
              {user.username?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <p className="truncate">{user.given_name}</p>
            <p className="truncate text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <PortalLink>
              <User /> Account
            </PortalLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <PortalLink>
              <CreditCard /> Biling
            </PortalLink>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutLink>
            <LogOutIcon /> Log out
          </LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
