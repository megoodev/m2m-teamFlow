import { Avatar } from "@/components/ui/avatar";
import { getAvatar } from "@/lib/git-avatar";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";

interface MemberItemProps {
  user: KindeUser<Record<string, unknown>>;
}
const MemberItem = ({ user }: MemberItemProps) => {
  return (
    <div>
      <Avatar>
        <Image src={getAvatar(user?.picture, user.email!)} alt="member image" />
      </Avatar>
    </div>
  );
};

export default MemberItem;
