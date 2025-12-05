import { Cloud, PlusCircle } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
}
const EmptyState = ({
  title,
  description,
  buttonText,
  href,
}: EmptyStateProps) => {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia className="rounded-md bg-primary/10">
          <Cloud className="size-5 text-primary" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
        <EmptyContent>
          <Link
            className={buttonVariants({
              className: "flex items-center gap-2",
              size: "sm",
            })}
            href={href}>
            <PlusCircle className="size-4" />
            {buttonText}
          </Link>
        </EmptyContent>
      </EmptyHeader>
    </Empty>
  );
};

export default EmptyState;
